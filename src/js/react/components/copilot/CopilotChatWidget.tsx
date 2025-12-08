import React, { useState, useRef, useEffect, use } from "react";
import { Tooltip } from "@primer/react";
import { CopilotIcon } from "@primer/octicons-react";
import { Message, Role } from "./types";
import ChatMessages from "./ChatMessages";
import ChatMessageInput from "./ChatMessageInput";
import useChat from "./useChat";
import CopilotChatHeader from "./CopilotChatHeader";
import { useConversation } from './contexts/ConversationProvider'

import * as styles from "./CopilotChatWidget.module.css";

// Storage keys for localStorage
const CHAT_OPEN_KEY = "github-copilot-chat-open";
const CHAT_MESSAGES_KEY = "github-copilot-chat-messages";

const defaultErrorMessages = {
  prohibitedCommand:
    "To address your issue, I cannot execute a command with potentially significant consequences. I recommend consulting documentation to explore a solution to your problem.",
  topicNotAllowed:
    "I can't help you with that topic. Let's try something else.",
  turnLimitReached:
    "It seems like this topic might be too complex for me to help you with, but we can try again in a new conversation.",
  conversationSizeLimitReached:
    "It seems like this conversation has grown too large for me to process. Please start a new conversation.",
  contentPolicyBreach:
    "I'm sorry, but the content of Copilot's response doesn't adhere to our guidelines. Could you please try another question?",
  notGrounded:
    "This topic is too complex for Copilot at the moment. Please open a ticket for a human to help you out.",
  unknownError: "Something went wrong, please try your question again.",
};

const hydrateMessages = (): Message[] => {
  try {
    const savedMessages = sessionStorage.getItem(CHAT_MESSAGES_KEY);
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages);
      return Array.isArray(parsedMessages)
        ? parsedMessages.map((msg: Message) => ({
          ...msg,
          createdAt: new Date(msg.createdAt!),
        }))
        : [];
    }
  } catch (e) {
    console.error("Error parsing saved messages:", e);
  }

  return [];
};

const CopilotChatWidget: React.FC = () => {
  const { loading, messages, sendUserQuery, setMessages } = useChat({
    chatContext: "well_architected",
    errorMessages: defaultErrorMessages,
    hydrateMessages,
  });

  const [isOpen, setIsOpen] = useState<boolean>(() => {
    try {
      const savedIsOpen = localStorage.getItem(CHAT_OPEN_KEY);
      return savedIsOpen ? JSON.parse(savedIsOpen) : false;
    } catch {
      return false;
    }
  });
  const { resetConversation } = useConversation();

  const inputRef = useRef<HTMLDivElement>(null);

  // Save chat state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(CHAT_OPEN_KEY, JSON.stringify(isOpen));
  }, [isOpen]);
  useEffect(() => {
    sessionStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Toggle chat open/close
  const handleToggleChat = React.useCallback((): void => {
    setIsOpen((prev) => !prev);
  }, []);

  // // Reset chat state
  const handleResetChat = React.useCallback((): void => {
    setMessages([]);
    sessionStorage.removeItem(CHAT_MESSAGES_KEY);
    resetConversation();
  }, []);

  return (
    <>
      {/* Floating Copilot Button */}
      {!isOpen && (
        <Tooltip text="Ask GitHub Copilot" direction="nw">
          <button
            aria-label="Open Copilot Chat"
            className={styles.copilotChatFloatingBtn}
            onClick={handleToggleChat}
            type="button"
          >
            <CopilotIcon size={28} fill="white" />
          </button>
        </Tooltip>
      )}

      {/* Floating Chat Panel */}
      {isOpen && (
        <div
          className={styles.copilotChatPanel}
          aria-modal="true"
          role="dialog"
          aria-label="GitHub Copilot Chat"
        >
          {/* Header */}
          <CopilotChatHeader
            loading={loading}
            onClose={handleToggleChat}
            onReset={handleResetChat}
          />

          {/* Messages Container */}
          <ChatMessages
            enableAutoScroll
            loading={loading}
            messages={messages}
          />

          {/* Input Container */}
          <div className={styles.inputContainer}>
            <ChatMessageInput
              ref={inputRef}
              disabled={loading}
              loading={loading}
              onSendMessage={sendUserQuery}
            />
          </div>
        </div>
      )}
    </>
  );
};

export { CopilotChatWidget };
