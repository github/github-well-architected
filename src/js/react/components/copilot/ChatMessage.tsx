import React, { useMemo } from 'react'
import { clsx } from 'clsx'
import { Spinner, RelativeTime, VisuallyHidden } from '@primer/react'
import { CopilotIcon, AlertFillIcon } from '@primer/octicons-react'
import ChatMessageContent from './ChatMessageContent'
import ChatMessageSources from './ChatMessageSources'
import { Role, Source as SourceType } from './types'
import FeedbackButtons from './FeedbackButtons'
import * as styles from './ChatMessage.module.css'

export interface Props extends React.ComponentProps<'div'> {
  content?: string
  createdAt?: Date
  isError?: boolean
  loading: boolean
  role?: Role
  sources?: SourceType[]
  streaming?: boolean
  messageNumber?: number
  totalMessages?: number
  warning?: string
  turnIndex?: number
}

export default function ChatMessage({
  className,
  content,
  createdAt,
  isError,
  loading = false,
  role,
  sources,
  streaming = false,
  messageNumber,
  totalMessages,
  warning = undefined,
  turnIndex,
  ...restProps
}: Props): React.ReactElement {
  const senderIsUser = role === Role.User
  const messageTimestamp = createdAt?.toLocaleTimeString('en-US')
  const copilotMessageInProgress = useMemo(
    () => !senderIsUser && (loading || streaming),
    [loading, senderIsUser, streaming]
  )

  const summaryPersonaText = useMemo(
    () => (senderIsUser ? `user sent` : 'Copilot received'),
    [senderIsUser]
  )

  /*
    This element makes sure to announce all of the metadata for each message;
    living inside of an element with the `log` role makes it a live region
    And the aria-busy attribute ensures that the message is not announced
    until it is fully loaded.
  */
  const messageSummaryText = useMemo(
    () => `Message ${messageNumber} of ${totalMessages} from ${summaryPersonaText} at ${messageTimestamp} ${content}`,
    [content, messageNumber, messageTimestamp, totalMessages, summaryPersonaText]
  )

  const CopilotAvatar = (): React.JSX.Element => {
    const avatarClasses = [
      styles.copilotAvatar,
      isError ? styles.copilotErrorAvatar : '',
      loading ? styles.copilotLoadingAvatar : ''
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div aria-hidden="true" className={avatarClasses}>
        <div className={loading || streaming ? styles.spinnerWrapper : styles.spinnerHidden}>
          <Spinner size="medium" className={styles.spinner} />
        </div>

        <CopilotIcon aria-label="Copilot avatar" size={12} />

        {isError ? (
          <div className={styles.errorIcon}>
            <AlertFillIcon size={12} />
          </div>
        ) : null}
      </div>
    )
  }

  const MessageSentNotice = (): React.JSX.Element => {
    return (
      <>
        {createdAt && (
          <>
            <VisuallyHidden>Message was sent </VisuallyHidden>
            <RelativeTime
              className={styles.relativeTime}
              date={createdAt}
              format="relative"
              tense="past"
              precision="minute"
            />
          </>
        )}
      </>
    )
  }

  const chatMessageHeader = (
    <div className={styles.messageHeader}>
      {messageNumber !== undefined && totalMessages !== undefined && (
        <VisuallyHidden>{messageSummaryText}</VisuallyHidden>
      )}

      {!senderIsUser && <CopilotAvatar />}

      <div aria-hidden="true" className={styles.personaInfo}>
        <span className={styles.personaName}>
          <VisuallyHidden>Message from </VisuallyHidden>
          {senderIsUser ? 'User' : 'Copilot'}
        </span>

        <span aria-live="polite" aria-atomic="true" className={styles.messageTime}>
          {copilotMessageInProgress ? `Generating...` : <MessageSentNotice />}
        </span>
      </div>
    </div>
  )

  return (
    <div
      className={clsx(styles.container, {
        [styles.streamingContainer]: streaming,
        [styles.userContainer]: senderIsUser
      }, className)}
      {...restProps}
    >
      {senderIsUser ? <VisuallyHidden>{chatMessageHeader}</VisuallyHidden> : chatMessageHeader}

      {sources && <ChatMessageSources sources={sources} />}

      <div className={clsx(styles.messageContent, { [styles.userMessageContent]: senderIsUser })}>
        <ChatMessageContent
          content={content}
          enableCodeDisclaimer={!senderIsUser}
          loading={loading}
          streaming={streaming}
          warning={warning}
        />
      </div>
      {turnIndex !== undefined && messageNumber === totalMessages && (
        <div className={styles.feedbackButtons}>
          <FeedbackButtons
            turnIndex={turnIndex}
            loading={loading}
            streaming={streaming}
            isError={isError}
          />
        </div>
      )}
    </div>
  )
}
