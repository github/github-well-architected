import { useCallback, useEffect, useState, useMemo } from 'react'
import { Message, Role, ChatErrorMessages } from './types'
import { CopilotAPIError, generateAnswer, isStreamData, StreamData, StreamDataSources, StreamType } from './api'
import { getMessagesForHydration } from './messageUtils'
import { useConversation } from './contexts/ConversationProvider'

// TODO: Implement proper error handling for API errors in the future
// For now, we're implementing only the happy path

const userQuestion = (content: string, createdAt?: Date): Message => ({
  content,
  createdAt: createdAt ?? new Date(),
  loading: false,
  role: Role.User
})

const streamingAnswer = (): Message => ({
  loading: true,
  role: Role.Assistant,
  streaming: true
})

interface Options {
  enableStartErrors?: boolean
  formName?: string
  chatContext: string
  errorMessages: ChatErrorMessages
  hydrateMessages?: () => Message[]
}

export interface MessageContext {
  content: string
  role: Role
}

interface Chat {
  error?: unknown
  firstAnswerReceived: boolean
  formName?: string
  loading: boolean
  messages: Message[]
  sendUserQuery: (userQuery: string) => void
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
}

export const useChat = ({ chatContext, errorMessages, hydrateMessages }: Options): Chat => {
  const { initialMessages, messageToRetry } = useMemo(() => getMessagesForHydration(hydrateMessages), []);

  const [messages, setMessages] = useState<Message[]>(initialMessages)
  // TODO: Handle and set stream errors
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, _setError] = useState<unknown>(null)
  const { conversationId, setConversationId } = useConversation()

  useEffect(() => {
    if (messageToRetry?.content) {
      sendUserQuery(messageToRetry.content, messageToRetry.createdAt);
    }
  }, [])

  const getErrorDetails = useCallback(
    (err: unknown): { message: string; shouldReport?: boolean } => {
      if (err instanceof CopilotAPIError && err.statusCode == 413) {
        return {
          message: errorMessages.conversationSizeLimitReached,
          shouldReport: false
        }
      }
      return {
        message: errorMessages.unknownError,
        shouldReport: true
      }
    },
    [errorMessages]
  )

  const updateMessageContent = useCallback(
    (messageIndex: number, text: string, { isChunk, isError = false }: { isChunk: boolean; isError?: boolean }) => {
      setMessages((currentMessages) => {
        const newConversationHistory = [...currentMessages]
        const message = newConversationHistory[messageIndex]!
        newConversationHistory[messageIndex] = {
          ...message,
          content: isChunk ? `${message.content || ''}${text}` : text,
          //  Set createdAt once we receive the first chunk of the response
          createdAt: message.createdAt || new Date(),
          isError,
          loading: false,
          // Reset sources in the case of an error
          sources: isError ? undefined : message.sources,
          // Reset streaming flag in the case of an error
          streaming: isError ? false : message.streaming,
          warning: isError ? undefined : message.warning
        }
        return newConversationHistory
      })
    },
    [setMessages]
  )

  const updateMessageWarning = useCallback(
    (messageIndex: number, warning: string) => {
      setMessages((currentMessages) => {
        const newConversationHistory = [...currentMessages]
        const message = newConversationHistory[messageIndex]!

        newConversationHistory[messageIndex] = {
          ...message,
          warning
        }
        return newConversationHistory
      })
    },
    [setMessages]
  )

  const updateMessageSources = useCallback(
    (messageIndex: number, sources: StreamDataSources['sources']) => {
      setMessages((currentMessages) => {
        const newConversationHistory = [...currentMessages]
        const message = newConversationHistory[messageIndex]!
        newConversationHistory[messageIndex] = {
          ...message,
          //  Set createdAt once we receive the first chunk of the response
          createdAt: message.createdAt || new Date(),
          sources: [...(message.sources || []), ...sources]
        }
        return newConversationHistory
      })
    },
    [setMessages]
  )

  const onStreamData = useCallback(
    (messageIndex: number, chunk?: StreamData | unknown) => {
      if (!isStreamData(chunk)) {
        // If there's no value in any given chunk, we can't be sure that we received enough of
        // the message to be useful to the user
        throw new Error(`Message is incomplete. Chunk received: ${JSON.stringify(chunk)}`)
      }

      const streamType = chunk.chunkType

      const isValidType = Object.values(StreamType).includes(streamType as StreamType)
      if (!isValidType) {
        throw new Error(`Unexpected error chunk during stream: ${JSON.stringify(chunk)}`)
      }

      switch (streamType) {
        case StreamType.MessageChunk:
          updateMessageContent(messageIndex, chunk.text, { isChunk: true })
          break
        case StreamType.Sources:
          updateMessageSources(messageIndex, chunk.sources)
          break
        case StreamType.CopilotOutputContentFilter:
          updateMessageContent(messageIndex, errorMessages.prohibitedCommand, { isChunk: false })
          break
        case StreamType.WarningFilter:
          updateMessageWarning(messageIndex, chunk.text)
          break
        // If a content filter error is thrown during streaming, this means that the message output from the model contains prohibited content
        // However, we can assume that the user's prompt message provoked the message output so we can still ask the user to rephrase their message
        case StreamType.RaiOutputContentFilter:
          updateMessageContent(messageIndex, errorMessages.contentPolicyBreach, { isChunk: false })
          break
        case StreamType.CopilotOutputNotGroundedFilter:
          updateMessageContent(messageIndex, errorMessages.notGrounded, { isChunk: false, isError: true })
          break
        case StreamType.ConversationId:
          // Store the conversation ID for future requests
          if ('conversation_id' in chunk) {
            setConversationId(chunk.conversation_id)
          }
          break
        default:
          // Handle unknown stream types
          // eslint-disable-next-line no-console
          console.error(`Unknown stream type: ${streamType}`)
      }
    },
    [updateMessageContent, updateMessageSources, updateMessageWarning, errorMessages, setConversationId]
  )

  const onStreamDone = useCallback(
    (messageIndex: number) => {
      setMessages((currentMessages) => {
        const newConversationHistory = [...currentMessages]
        const message = newConversationHistory[messageIndex]!

        // In case the message finished streaming without any content and we didn't expect it, we need to capture it as an error
        if (!message.content) {
          const messageError = new Error('Message finished streaming without any content')
          const { message: errorMessage, shouldReport } = getErrorDetails(error)
          newConversationHistory[messageIndex] = {
            ...message,
            content: errorMessage,
            sources: undefined,
            isError: true
          }

          // TODO: replace with a way to send the error to Sentry
          // eslint-disable-next-line no-console
          if (shouldReport) console.error(messageError)
        }

        newConversationHistory[messageIndex] = {
          ...newConversationHistory[messageIndex],
          createdAt: newConversationHistory[messageIndex]?.createdAt || new Date(),
          loading: false,
          streaming: false
        }

        return newConversationHistory
      })
    },
    [error, getErrorDetails]
  )

  const sendUserQuery = useCallback(
    (userQuery: string, createdAt?: Date) => {
      const newMessages = [...messages, userQuestion(userQuery, createdAt), streamingAnswer()]
      // The index of the streaming answer placeholder
      const newResponseIndex = newMessages.length - 1
      setMessages(newMessages)

      const getStreamingResponse = async () => {
        try {
          await generateAnswer({
            chatContext,
            messages,
            query: userQuery,
            onData: (value) => {
              onStreamData(newResponseIndex, value)
            },
            onDone: (ondoneError) => {
              // Let the catch block handle any errors
              if (ondoneError) return
              onStreamDone(newResponseIndex)
            }
          })
        } catch (err: unknown) {
          const { message, shouldReport } = getErrorDetails(err)
          // eslint-disable-next-line no-console
          if (shouldReport) console.error(err)
          updateMessageContent(newResponseIndex, message, { isChunk: false, isError: true })
        }
      }
      getStreamingResponse()
    },
    [chatContext, getErrorDetails, messages, onStreamData, onStreamDone, updateMessageContent]
  )

  return {
    error,
    firstAnswerReceived: messages.some(({ loading, role }) => role === Role.Assistant && !loading),
    loading: messages.some(({ loading, streaming }) => loading || streaming),
    messages,
    sendUserQuery,
    setMessages,
  }
}

export default useChat
