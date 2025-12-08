import { useCallback, useState, MouseEvent } from 'react'
import { ThumbsupIcon, ThumbsdownIcon } from '@primer/octicons-react'
import { IconButton, Spinner, VisuallyHidden } from '@primer/react'
import { clsx } from 'clsx'
import { submitFeedback } from './api'
import { useConversation } from './contexts/ConversationProvider'
import * as styles from './FeedbackButtons.module.css'

export type FeedbackType = 'POSITIVE' | 'NEGATIVE' | undefined

enum FeedbackState {
  Idle = 'Idle',
  Loading = 'Loading',
  Error = 'Error',
  Submitted = 'Submitted'
}

interface Props {
  turnIndex: number
  className?: string
  loading?: boolean
  streaming?: boolean
  isError?: boolean
}

export default function FeedbackButtons({
  turnIndex,
  className,
  loading = false,
  streaming = false,
  isError = false
}: Props) {
  const [feedback, setFeedback] = useState<FeedbackType>(undefined)
  const [feedbackState, setFeedbackState] = useState<FeedbackState>(FeedbackState.Idle)
  const { conversationId } = useConversation()
  // Users always give feedback for the previous turn, so we use turnIndex - 1
  const previousTurnIndex = turnIndex - 1

  const handleFeedbackSubmission = useCallback(
    async (feedbackType: 'POSITIVE' | 'NEGATIVE') => {
      if (!conversationId) {
        // eslint-disable-next-line no-console
        console.error('Cannot submit feedback: no conversation ID available')
        return
      }

      const requestBody = {
        // eslint-disable-next-line camelcase
        conversation_id: conversationId,
        // eslint-disable-next-line camelcase
        turn_index: previousTurnIndex,
        type: feedbackType,
        // eslint-disable-next-line camelcase
        chat_context: 'well_architected',
      }

      await submitFeedback(requestBody)
    },
    [conversationId, previousTurnIndex]
  )

  const handlePositiveFeedback = useCallback(
    async (e: MouseEvent<HTMLElement>) => {
      e.preventDefault()
      if (feedbackState === FeedbackState.Loading || feedback === 'POSITIVE') return

      setFeedbackState(FeedbackState.Loading)
      try {
        await handleFeedbackSubmission('POSITIVE')
        setFeedback('POSITIVE')
        setFeedbackState(FeedbackState.Submitted)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error submitting positive feedback:', err)
        setFeedbackState(FeedbackState.Error)
        setTimeout(() => {
          setFeedbackState(FeedbackState.Idle)
        }, 2500)
      }
    },
    [feedback, feedbackState, handleFeedbackSubmission]
  )

  const handleNegativeFeedback = useCallback(
    async (e: MouseEvent<HTMLElement>) => {
      e.preventDefault()
      if (feedbackState === FeedbackState.Loading || feedback === 'NEGATIVE') return

      setFeedbackState(FeedbackState.Loading)
      try {
        await handleFeedbackSubmission('NEGATIVE')
        setFeedback('NEGATIVE')
        setFeedbackState(FeedbackState.Submitted)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error submitting negative feedback:', err)
        setFeedbackState(FeedbackState.Error)
        setTimeout(() => {
          setFeedbackState(FeedbackState.Idle)
        }, 2500)
      }
    },
    [feedback, feedbackState, handleFeedbackSubmission]
  )

  // Don't render if no conversation ID is available yet or if message hasn't finished streaming successfully
  if (!conversationId || loading || streaming || isError) {
    return null
  }

  const isLoading = feedbackState === FeedbackState.Loading
  const isPositiveSelected = feedback === 'POSITIVE'
  const isNegativeSelected = feedback === 'NEGATIVE'

  return (
    <div className={clsx(styles.container, className)}>
      <VisuallyHidden>
        {feedbackState !== FeedbackState.Loading && feedback ? `${feedback.toLowerCase()} feedback given` : ''}
      </VisuallyHidden>

      {feedbackState === FeedbackState.Submitted ? (
        <p className={styles.submissionMessage}>Thank you! We received your feedback.</p>
      ) : (
        <>
          <IconButton
            aria-label="Give positive feedback"
            aria-pressed={isPositiveSelected}
            icon={ThumbsupIcon}
            onClick={handlePositiveFeedback}
            size="small"
            className={clsx({
              [styles.buttonLoading]: isLoading,
              [styles.buttonDisabled]: isLoading || isPositiveSelected
            })}
            title="Send positive feedback"
            tooltipDirection="ne"
            variant={isPositiveSelected ? 'default' : 'invisible'}
          />
          <IconButton
            aria-label="Give negative feedback"
            aria-pressed={isNegativeSelected}
            icon={ThumbsdownIcon}
            onClick={handleNegativeFeedback}
            size="small"
            className={clsx({
              [styles.buttonLoading]: isLoading,
              [styles.buttonDisabled]: isLoading || isNegativeSelected
            })}
            title="Send negative feedback"
            tooltipDirection="ne"
            variant={isNegativeSelected ? 'default' : 'invisible'}
          />
          {isLoading && <Spinner aria-label="Submitting feedback" size="small" />}
          {feedbackState === FeedbackState.Error && (
            <p className={styles.errorMessage}>Feedback not registered. Please try again.</p>
          )}
        </>
      )}
    </div>
  )
}
