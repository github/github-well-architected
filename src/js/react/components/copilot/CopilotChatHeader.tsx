import React from 'react';
import { Heading, IconButton } from '@primer/react';
import { PlusIcon, XIcon } from '@primer/octicons-react';
import * as styles from './CopilotChatHeader.module.css';

interface CopilotChatHeaderProps {
  loading?: boolean;
  onClose: () => void;
  onReset: () => void;
}

const CopilotChatHeader: React.FC<CopilotChatHeaderProps> = React.memo(({ loading, onClose, onReset }) => {
  return (
    <header className={styles.copilotChatHeader} role="banner">
      <Heading as="h2" variant="small">
        Copilot
      </Heading>
      <div role="group" aria-label="Chat actions">
        <IconButton
          aria-label="New conversation"
          icon={PlusIcon}
          size="small"
          className={styles.copilotChatHeaderButton}
          onClick={onReset}
          disabled={loading}
        />
        <span className={styles.copilotChatHeaderSeparator} />
        <IconButton
          aria-label="Close chat"
          icon={XIcon}
          size="small"
          onClick={onClose}
          className={styles.copilotChatHeaderButton}
        />
      </div>
    </header>
  );
});

export default CopilotChatHeader;