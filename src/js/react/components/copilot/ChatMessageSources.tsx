import React from 'react'
import { TreeView } from '@primer/react'
import { BookIcon } from '@primer/octicons-react'
import { Source } from './types'
import * as styles from './ChatMessageSources.module.css'

type Props = {
  sources: Source[]
}

const ChatMessageSource = ({ url, title }: Source) => {
  return (
    <TreeView.Item
      key={url}
      aria-label={title}
      id={url}
      onSelect={() => {
        window.open(url, '_blank')
      }}
    >
      <TreeView.LeadingVisual>
        <BookIcon className={styles.button} aria-label={title} size={11} />
      </TreeView.LeadingVisual>
      {title}
    </TreeView.Item>
  )
}

export default function ChatMessageSources({ sources }: Props): React.JSX.Element {
  if (!sources[0]) {
    return <></>
  }

  return (
    <TreeView aria-label="List of sources used to generate response" className={styles.container} flat>
      <TreeView.Item id="chat-message-references" defaultExpanded={false}>
        {`Used ${sources.length} reference${sources.length === 1 ? '' : 's'}`}
        <TreeView.SubTree>
          {sources.map((source) => (
            <ChatMessageSource key={source.index} {...source} />
          ))}
        </TreeView.SubTree>
      </TreeView.Item>
    </TreeView>
  )
}
