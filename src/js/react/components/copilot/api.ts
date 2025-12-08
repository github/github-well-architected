import ndjson from './fetchNDJSON'
import { APIErrorType, Message, Role } from './types'

interface CopilotAPIErrorOptions extends ErrorOptions {
  detail?: APIErrorType
  statusCode?: number
}

export class CopilotAPIError extends Error {
  detail?: APIErrorType
  statusCode?: number

  constructor(msg: string, { detail, statusCode, ...restOptions }: CopilotAPIErrorOptions | undefined = {}) {
    super(msg, restOptions)
    Object.setPrototypeOf(this, CopilotAPIError.prototype)
    this.name = 'CopilotAPIError'
    this.statusCode = statusCode
    this.detail = detail
  }
}

class CopilotAPITimeoutError extends Error {
  chunksReceived: number
  statusCode?: number
  statusText?: string
  headers?: Headers

  constructor(chunksReceived: number, response?: Response, message = 'Request timed out') {
    super(`${message} while waiting for chunk ${chunksReceived}. Response status: ${response?.status}`)
    this.name = 'CopilotAPITimeoutError'
    this.chunksReceived = chunksReceived
    Object.setPrototypeOf(this, CopilotAPITimeoutError.prototype)
  }
}

const INITIAL_CHUNK_TIMEOUT_MS = 12500
const SUBSEQUENT_CHUNK_TIMEOUT_MS = 3500
const INITIAL_CHUNK_TIMEOUT_ABORT_REASON = 'INITIAL_CHUNK_TIMEOUT_ABORT'
const SUBSEQUENT_CHUNK_TIMEOUT_ABORT_REASON = 'SUBSEQUENT_CHUNK_TIMEOUT_ABORT'

interface RequestTimeoutOptions {
  controller: AbortController
  oldTimeoutId?: ReturnType<typeof setTimeout>
  timeoutDuration: typeof INITIAL_CHUNK_TIMEOUT_MS | typeof SUBSEQUENT_CHUNK_TIMEOUT_MS
}

const newRequestTimeout = ({ oldTimeoutId, controller, timeoutDuration }: RequestTimeoutOptions) => {
  if (oldTimeoutId) clearTimeout(oldTimeoutId)

  return setTimeout(() => {
    const abortReason =
      timeoutDuration === INITIAL_CHUNK_TIMEOUT_MS
        ? INITIAL_CHUNK_TIMEOUT_ABORT_REASON
        : SUBSEQUENT_CHUNK_TIMEOUT_ABORT_REASON
    controller.abort(abortReason)
  }, timeoutDuration)
}

const getApiUrl = (endpoint: string): string => {
  const currentHostname = new URL(window?.location?.href).hostname;
  if (currentHostname.endsWith('.drafts.github.io')) {
    return `https://github-well-architected-internal-staging.service.iad.github.net/api/${endpoint}`;
  } else {
    return `/api/${endpoint}`;
  }
}

// Type guard for stream data
export const isStreamData = (data: StreamData | unknown): data is StreamData => {
  return !!data && (data as StreamData).chunkType !== undefined
}

export enum StreamType {
  MessageChunk = 'MESSAGE_CHUNK',
  WarningFilter = 'WARNING',
  RaiOutputContentFilter = 'RAI_OUTPUT_CONTENT_FILTER',
  CopilotOutputContentFilter = 'COPILOT_OUTPUT_CONTENT_FILTER',
  CopilotOutputNotGroundedFilter = 'COPILOT_OUTPUT_NOT_GROUNDED_FILTER',
  Sources = 'SOURCES',
  ConversationId = 'CONVERSATION_ID',
}

export interface StreamDataSources {
  sources: Array<{
    index: string
    title: string
    url: string
  }>
  chunkType: StreamType.Sources
}

export interface StreamDataMessageChunk {
  text: string
  chunkType: StreamType.MessageChunk
}

export interface StreamDataRaiOutputContentFilter {
  chunkType: StreamType.RaiOutputContentFilter
}

export interface StreamDataWarning {
  text: string
  chunkType: StreamType.WarningFilter
}

export interface StreamDataCopilotOutputContentFilter {
  chunkType: StreamType.CopilotOutputContentFilter
}

export interface StreamCopilotOutputNotGroundedFilter {
  chunkType: StreamType.CopilotOutputNotGroundedFilter
}

export interface StreamDataConversationId {
  chunkType: StreamType.ConversationId
  conversation_id: string
}

export type StreamData = {
  chunkType: StreamType
} & (
    | StreamDataMessageChunk
    | StreamDataRaiOutputContentFilter
    | StreamDataSources
    | StreamDataCopilotOutputContentFilter
    | StreamCopilotOutputNotGroundedFilter
    | StreamDataWarning
    | StreamDataConversationId
  )

export type StreamDataError = {
  chunkType: 'ERROR'
  detail?: APIErrorType
  error: string
}

interface GenerateAnswerOptions {
  chatContext: string
  messages: Message[]
  onData: (data: StreamData | unknown) => void
  onDone: (error?: CopilotAPIError) => void
  query: string
}

export const generateAnswer = async ({
  chatContext,
  messages,
  onData,
  onDone,
  query,
}: GenerateAnswerOptions) => {
  const controller = new AbortController()

  // Get current page path for included_document
  // Remove trailing slash if present to match Azure AI search index format of the `path` field
  const currentPagePath = window.location.pathname.replace(/\/$/, '') || '/';
  const requestBody: Record<string, unknown> = {
    chat_context: chatContext,
    history: messages.map(({ content, role }) => ({
      content: content || '',
      role: role || Role.User
    })),
    query,
    stream: true,
    docs_source: "docs_ghec_en",
    user_context: [], // No user context as specified in requirements
    // Only include included_document for non-home pages
    ...(currentPagePath !== '/' && { included_document: currentPagePath })
  }

  const request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody),
    signal: controller.signal,
  }

  let response

  // If the timeout is reached before the response is received, the request will be aborted
  // and the error will be caught in the catch block below
  let timeoutId = newRequestTimeout({ controller, timeoutDuration: INITIAL_CHUNK_TIMEOUT_MS })
  let chunksReceived = 0
  let error
  try {

    const apiUrl = getApiUrl('answers')
    response = await fetch(apiUrl, request)
    const isHTTPError = response.status >= 400 && response.status < 600
    const isStreamError = response.headers.has('X-Stream-Error')
    const hasError = !response.ok || isHTTPError || isStreamError

    if (hasError) {
      let detail
      let errorMessage
      try {
        const json = (await response.json()) as StreamDataError
        detail = json?.detail
        errorMessage = json?.error
      } catch (e) {
        // error details are not always available, so we can continue
      }
      throw new CopilotAPIError(`Error generating chat answer: ${errorMessage || 'An unknown error occurred'}`, {
        statusCode: response.status,
        detail,
      })
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new CopilotAPIError('Cannot read response body', {
        statusCode: response.status,
      })
    }

    const jsonStreamer = ndjson<StreamData>(reader)

    // eslint-disable-next-line no-constant-condition
    while (true) {
      // We need to make sure there is a shorter timeout for subsequent chunks
      // Because if the streaming is slow we want the user to be able to create a ticket quickly
      const timeoutDuration = chunksReceived === 0 ? INITIAL_CHUNK_TIMEOUT_MS : SUBSEQUENT_CHUNK_TIMEOUT_MS
      timeoutId = newRequestTimeout({ controller, oldTimeoutId: timeoutId, timeoutDuration })
      const { done, value } = await jsonStreamer.next()

      if (done) {
        // When `done` evaluates to true, the stream has been fully processed on the previous iteration,
        // so we intentionally break out of the while loop
        break
      }

      chunksReceived++
      onData(value)
    }
  } catch (err: unknown) {
    // Catch AbortError and add more details about the timeout for debugging purposes
    if (
      typeof err == 'string' &&
      (err === INITIAL_CHUNK_TIMEOUT_ABORT_REASON || err === SUBSEQUENT_CHUNK_TIMEOUT_ABORT_REASON)
    ) {
      error = new CopilotAPITimeoutError(chunksReceived, response)
    } else if (err instanceof CopilotAPIError) {
      error = err
    } else {
      error = new CopilotAPIError(`${err instanceof Error ? err.message : String(err)}`, { cause: err })
    }
    throw error
  } finally {
    onDone(error)
    clearTimeout(timeoutId)
  }
}

interface FeedbackRequestBody {
  conversation_id: string
  turn_index: number
  type: 'POSITIVE' | 'NEGATIVE'
  chat_context: string
}

export const submitFeedback = async (feedbackData: FeedbackRequestBody): Promise<void> => {
  const apiUrl = getApiUrl('feedback')

  const request = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(feedbackData),
  }

  try {
    const response = await fetch(apiUrl, request)

    if (!response.ok) {
      throw new CopilotAPIError(`Error submitting feedback: HTTP ${response.status}`, {
        statusCode: response.status,
      })
    }
  } catch (err: unknown) {
    if (err instanceof CopilotAPIError) {
      throw err
    } else {
      throw new CopilotAPIError(`${err instanceof Error ? err.message : String(err)}`, { cause: err })
    }
  }
}