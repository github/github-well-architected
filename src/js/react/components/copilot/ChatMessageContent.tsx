import React, { useCallback, useState, useEffect } from 'react'
import { Flash } from '@primer/react'
import clsx from 'clsx'
import * as styles from './ChatMessageContent.module.css'
import Markdown from './Markdown'

export const CODE_DISCLAIMER_TEXT =
  'Commands can have significant and potentially irreversible effects on your system or data. Please ensure you understand the implications before proceeding.'

export interface Props extends React.ComponentProps<'div'> {
  content?: string
  enableCodeDisclaimer?: boolean
  loading: boolean
  streaming: boolean
  warning?: string
}

export default function ChatMessageContent({
  className,
  content,
  enableCodeDisclaimer = true,
  loading = false,
  streaming = false,
  warning,
  ...restProps
}: Props): React.JSX.Element {
  const [codeDetected, setCodeDetected] = useState(false)

  const handleCodeDetected = useCallback(() => {
    if (!codeDetected) {
      setCodeDetected(true)
    }
  }, [codeDetected])

  return (
    <div className={clsx(styles.container, className)} {...restProps}>
      {!loading ? (
        <>
          {enableCodeDisclaimer && codeDetected && (
            <Flash variant="warning" aria-live="polite" className={styles.warningFlash}>
              {CODE_DISCLAIMER_TEXT}
            </Flash>
          )}
          {warning != null && warning !== '' && (
            <Flash variant="warning" aria-live="polite" className={styles.warningFlash}>
              {warning}
            </Flash>
          )}
          <Markdown content={`${content ?? ''}${streaming ? '...' : ''}`} onCodeDetected={handleCodeDetected} />
        </>
      ) : (
        // 21px height ensures that the box is as large as an answer with a single line of content
        <div className={styles.emptyBox} />
      )}
    </div>
  )
}
