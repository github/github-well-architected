import { createContext, ReactNode, useCallback, useContext, useState } from 'react'

interface ConversationContextState {
  conversationId: string | null
  setConversationId: (id: string) => void
  resetConversation: () => void
}

const ConversationContext = createContext<ConversationContextState | undefined>(undefined)

interface ConversationProviderProps {
  children: ReactNode
}

export function ConversationProvider({ children }: ConversationProviderProps) {
  const [conversationId, setConversationIdState] = useState<string | null>(null)

  const setConversationId = useCallback((id: string) => {
    setConversationIdState(id)
  }, [])

  const resetConversation = useCallback(() => {
    setConversationIdState(null)
  }, [])

  const contextValue = {
    conversationId,
    setConversationId,
    resetConversation
  }

  return <ConversationContext.Provider value={contextValue}>{children}</ConversationContext.Provider>
}

export function useConversation() {
  const context = useContext(ConversationContext)
  if (!context) {
    throw new Error('useConversation must be used within a ConversationProvider')
  }
  return context
}
