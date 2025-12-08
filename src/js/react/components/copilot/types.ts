export interface Message {
  content?: string
  createdAt?: Date
  loading: boolean
  role?: Role
  isError?: boolean
  sources?: Source[]
  streaming?: boolean
  warning?: string
}

interface MessageWithNumber extends Message {
  messageNumber: number
}

export type MessageGroup = [MessageWithNumber, MessageWithNumber] | [MessageWithNumber]

export interface ChatErrorMessages {
  prohibitedCommand: string
  topicNotAllowed: string
  turnLimitReached: string
  conversationSizeLimitReached: string
  contentPolicyBreach: string
  notGrounded: string
  unknownError: string
}

export type SourceType = 'githubDocs' | 'supportTicket' | 'escalationIssue' | 'supportKb'

export interface Source {
  index: string
  title: string
  // type: SourceType | string
  url: string
}

export enum Role {
  User = 'user',
  Assistant = 'assistant'
}

export interface Session {
  id: string
  hmac_id: string
}

export enum APIErrorType {
  TopicNotAllowed = 'TOPIC_NOT_ALLOWED',
  TurnLimitReached = 'TURN_LIMIT_REACHED',
  ContentPolicyBreach = 'CONTENT_POLICY_BREACH',
  NetworkError = 'NETWORK_ERROR',
  ServerError = 'SERVER_ERROR',
  ClientError = 'CLIENT_ERROR',
}