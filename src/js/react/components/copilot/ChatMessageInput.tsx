import React, { ComponentProps, forwardRef, useState, useRef, useCallback } from 'react'
import { IconButton, FormControl } from '@primer/react'
import { PaperAirplaneIcon } from '@primer/octicons-react'
import * as styles from './ChatMessageInput.module.css'

type Ref = HTMLDivElement

interface Props extends ComponentProps<typeof FormControl> {
  loading?: boolean
  onSendMessage: (message: string) => void
}

export default forwardRef<Ref, Props>(function ChatMessageInput(
  { disabled, loading, onSendMessage, ...restProps },
  ref
) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSendMessage = !disabled && !loading && message.trim().length > 0;

  const resizeTextarea = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    resizeTextarea();
  };

  const send = useCallback(() => {
    if (!canSendMessage) return;
    onSendMessage(message.trim());
    setMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [canSendMessage, message, onSendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send();
    }
  };

  return (
    <FormControl disabled={disabled || loading} {...restProps} ref={ref} className={styles.formControl}>
      <FormControl.Label visuallyHidden>Ask Copilot</FormControl.Label>
      <div
        className={styles.inputWrapper}
        data-focus={isFocused}
      >
        <textarea
          ref={textareaRef}
          autoFocus
          data-testid="chat-message-input"
          className={styles.textInput}
          style={{ height: 'auto' }}
          onChange={handleInputChange}
          placeholder={loading ? 'Generating your answer...' : 'Ask Copilot'}
          disabled={disabled || loading}
          value={message}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={1}
        />
        <IconButton
          aria-label="Send now"
          data-testid="send-message-button"
          className={styles.sendButton}
          disabled={!canSendMessage}
          variant="invisible"
          size="medium"
          icon={PaperAirplaneIcon}
          tooltipDirection="n"
          onClick={send}
        />
      </div>
    </FormControl>
  );
});
