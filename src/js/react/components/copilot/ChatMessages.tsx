import React, { useEffect, useMemo } from 'react'
import { IconButton } from '@primer/react'
import { ArrowDownIcon } from '@primer/octicons-react'
import { clsx } from 'clsx'
import { useChatScroll, ChatScrollProvider } from './contexts/ChatScrollProvider'
import ChatMessage from './ChatMessage'
import { getMessageGroups } from './messageUtils'
import { Message, MessageGroup, Role } from './types'
import * as styles from './ChatMessages.module.css'

interface FooterRenderProps {
  conversationHistory: Message[]
  loading: boolean
}

interface GroupProps extends Omit<Props, 'enableAutoScroll'> {
  isLastGroup: boolean
  messageGroup: MessageGroup
}

interface Props extends React.ComponentProps<'div'> {
  enableAutoScroll?: boolean
  loading: boolean
  messages: Message[]
  renderLastAnswerFooter?: (renderProps: FooterRenderProps) => React.ReactNode
}

// Based on https://github.com/github/github/blob/b00a2e451f0c4d7c55d48af38a4eda9340c714dd/ui/packages/copilot-immersive-v1/components/ImmersiveChat.tsx#L251
const ScrollToBottomButton = ({ className }: Pick<React.ComponentProps<typeof IconButton>, 'className'>) => {
  const { isScrolledUp, scrollToBottom } = useChatScroll()

  return (
    <IconButton
      aria-label="Scroll to bottom"
      className={clsx(styles.scrollToBottomButton, { [styles.scrollToBottomButtonHidden]: !isScrolledUp }, className)}
      icon={ArrowDownIcon}
      onClick={(e) => {
        e.preventDefault()
        scrollToBottom('smooth')
      }}
      size="small"
      tooltipDirection="n"
    />
  )
}

const ChatMessageGroup = ({
  className,
  isLastGroup,
  loading,
  messageGroup,
  messages,
  renderLastAnswerFooter,
  ...restProps
}: GroupProps): React.JSX.Element => {
  const { scrollContainerHeight, scrollToBottom } = useChatScroll()

  const filteredAssistantMessages = useMemo(
    () => messages.filter((m) => m.role === Role.Assistant && m.loading === false),
    [messages]
  )

  // Instant scroll to bottom on mount
  useEffect(() => {
    scrollToBottom('instant')
  }, [scrollToBottom])

  useEffect(() => {
    if (isLastGroup) scrollToBottom('smooth')
  }, [isLastGroup, scrollToBottom])

  const lastGroupStyles = {
    minHeight: window.CSS?.supports('container-type: size') ? '100cqh' : scrollContainerHeight
  }

  return (
    <div
      style={isLastGroup ? lastGroupStyles : undefined}
      className={clsx(styles.messageGroup, className)}
      {...restProps}
    >
      {messageGroup.map((message, index) => {
        // Calculate turnIndex using filtered assistant messages
        const turnIndex = message.role === Role.Assistant ? Math.floor(filteredAssistantMessages.length) : undefined

        return (
          <div
            key={index}
            role="log"
            aria-busy={message.loading || message.streaming}
            aria-current={index === messageGroup.length - 1}
            className={styles.messageContainer}
          >
            <ChatMessage totalMessages={messages.length} turnIndex={turnIndex} {...message} />

            {index === messageGroup.length - 1 &&
              renderLastAnswerFooter &&
              renderLastAnswerFooter({
                conversationHistory: messages,
                loading
              })}
          </div>
        )
      })}
    </div>
  )
}

export default function ChatMessages({
  className,
  enableAutoScroll,
  loading,
  messages,
  renderLastAnswerFooter,
  ...restProps
}: Props): React.JSX.Element {
  const messageGroups = getMessageGroups(messages)

  return (
    <ChatScrollProvider className={clsx(styles.container, className)} disabled={!enableAutoScroll} {...restProps}>
      <div className={styles.systemMessageContent}>
        AI may be inaccurate. Conversations may be logged to improve quality.
      </div>

      <div className={styles.messagesContainer}>
        <ChatMessage
          role={Role.Assistant}
          content={
            "👋 **Welcome!**  \nI\'m WAF Copilot, here to help with GitHub best practices."
          }
          loading={false}
          streaming={false}
          isError={false}
        />

        {messageGroups.map((messageGroup, index: number) => {
          const isLastGroup = index === messageGroups.length - 1

          return (
            <ChatMessageGroup
              className={clsx({ [styles.lastMessageGroup]: isLastGroup })}
              key={`message-group-${messageGroup[0].messageNumber}`}
              isLastGroup={isLastGroup}
              loading={loading}
              messages={messages}
              messageGroup={messageGroup}
              renderLastAnswerFooter={renderLastAnswerFooter}
            />
          )
        })}
      </div>

      <div className={styles.scrollToBottomButtonContainer}>
        <ScrollToBottomButton />
      </div>
    </ChatScrollProvider>
  )
}
