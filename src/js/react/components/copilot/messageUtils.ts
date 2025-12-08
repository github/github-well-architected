import { Message, MessageGroup, Role } from './types'

export const getMessageGroups = (messages: Message[]): MessageGroup[] => {
  return messages.reduce<MessageGroup[]>((acc, message, i) => {
    const messageWithNumber: MessageGroup[0] = {
      ...message,
      messageNumber: i + 1 // Assign a number to each message starting from 1
    }

    if (message.role === "user") {
      // if message is from the user, add a new group
      acc.push([messageWithNumber])
    } else {
      // otherwise, add the message to the previous group
      const group = acc[acc.length - 1] ?? [];
      group.push(messageWithNumber);
      acc[acc.length ? acc.length - 1 : 0] = group;
    }
    return acc
  }, []);
}

export const getMessagesForHydration = (hydrateMessages?: () => Message[]): { initialMessages: Message[], messageToRetry?: Message } => {
  const initialMessages = hydrateMessages ? [...hydrateMessages()] : [];
  const lastMessage = initialMessages.at(-1);
  let messageToRetry: Message | undefined;

  if (!lastMessage) return { initialMessages, messageToRetry };

  if (lastMessage.role !== Role.User && (lastMessage.loading || lastMessage.streaming)) {
    // Discard any partial response
    initialMessages.pop();
  }

  const newLastMessage = initialMessages.at(-1);
  if (newLastMessage?.role === Role.User) {
    messageToRetry = initialMessages.pop();
  }

  return { initialMessages, messageToRetry }
}
