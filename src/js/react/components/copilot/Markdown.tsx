import React, { useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import * as styles from './Markdown.module.css'

interface MarkdownProps {
  content?: string
  onCodeDetected?: () => void
}

type ReactMarkdownProps = React.ComponentProps<typeof ReactMarkdown>

const REMARK_PLUGINS: ReactMarkdownProps['remarkPlugins'] = [
  // Adds support GitHub flavored markdown, including autolink literals, footnotes, strikethrough, tables, tasklist
  remarkGfm
]

const REHYPE_PLUGINS: ReactMarkdownProps['rehypePlugins'] = [
  // Adds target blank to external links
  [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
  // Though ReactMarkdown is secure by default against XSS attack vectors, using this *at the end* of the plugins pipeline
  // adds an extra layer of security to protect against any potentially insecure plugin code
  rehypeSanitize
]


const Markdown: React.FC<MarkdownProps> = ({ content, onCodeDetected }: MarkdownProps) => {
  const [codeAlreadyDetected, setCodeAlreadyDetected] = useState(false)

  React.useEffect(() => {
    if (!codeAlreadyDetected && content) {
      // Simple regex to detect code blocks (``` or indented)
      const hasCode = /```[\s\S]*?```|\n    .+/.test(content)
      if (hasCode) {
        setCodeAlreadyDetected(true)
        onCodeDetected?.()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, codeAlreadyDetected, onCodeDetected])

  return (
    <div aria-hidden="true" className={styles.markdownBody}>
      <ReactMarkdown
        components={{
          code({ children, ...restCodeProps }) {
            return <code {...restCodeProps}>{children}</code>
          }
        }}
        rehypePlugins={REHYPE_PLUGINS}
        remarkPlugins={REMARK_PLUGINS}
      >
        {`${content}`}
      </ReactMarkdown>
    </div>
  )
}

export default Markdown
