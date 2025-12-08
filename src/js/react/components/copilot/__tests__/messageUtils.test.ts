import { Message, MessageGroup, Role } from '../types'
import { getMessageGroups, getMessagesForHydration } from '../messageUtils'

describe('getMessageGroups', () => {
    it('groups messages correctly', () => {
        const messages: Message[] = [
            { content: 'How do I reset my password?', role: Role.User, createdAt: new Date(), loading: false },
            {
                content: 'I can help with that.  Have you tried going through the password reset flow?',
                role: Role.Assistant,
                createdAt: new Date(),
                loading: false
            },
            {
                content: "Yes, but I don't have access to my old email address",
                role: Role.User,
                createdAt: new Date(),
                loading: false
            },
            { content: 'Sorry, I am unable to assist with that.', role: Role.Assistant, createdAt: new Date(), loading: false }
        ]

        const expectedGroups: MessageGroup[] = [
            [
                { ...messages[0], messageNumber: 1 },
                { ...messages[1], messageNumber: 2 }
            ],
            [
                { ...messages[2], messageNumber: 3 },
                { ...messages[3], messageNumber: 4 }
            ]
        ]

        const result = getMessageGroups(messages)
        expect(result).toEqual(expectedGroups)
    })

    it('handles empty messages', () => {
        const messages: Message[] = []

        const result = getMessageGroups(messages)
        expect(result).toEqual([])
    })

    it('handles starting with a Copilot message', () => {
        const messages: Message[] = [
            { content: 'Hi, how can I help?', role: Role.Assistant, createdAt: new Date(), loading: false },
            { content: 'How do I reset my password?', role: Role.User, createdAt: new Date(), loading: false },
            {
                content: 'I can help with that.  Have you tried going through the password reset flow?',
                role: Role.Assistant,
                createdAt: new Date(),
                loading: false
            },
        ]

        const expectedGroups: MessageGroup[] = [
            [
                { ...messages[0], messageNumber: 1 },
            ],
            [{ ...messages[1], messageNumber: 2 }, { ...messages[2], messageNumber: 3 }]
        ]

        const result = getMessageGroups(messages)
        expect(result).toEqual(expectedGroups)
    })
})

describe('getMessagesForHydration', () => {
    it('returns empty array when no hydration function is provided', () => {
        const result = getMessagesForHydration();
        expect(result).toEqual({ initialMessages: [], messageToRetry: undefined });
    });

    it('uses messages from the hydration function when provided', () => {
        const mockMessages: Message[] = [
            { content: 'How do I reset my password?', role: Role.User, createdAt: new Date(), loading: false },
            { content: 'I can help with that', role: Role.Assistant, createdAt: new Date(), loading: false }
        ];

        const hydrateMessages = jest.fn().mockReturnValue(mockMessages);

        const result = getMessagesForHydration(hydrateMessages);

        expect(hydrateMessages).toHaveBeenCalledTimes(1);
        expect(result).toEqual({
            initialMessages: mockMessages,
            messageToRetry: undefined,
        });
    });

    it('discards partial response when last message is from Copilot and is loading', () => {
        const mockMessages: Message[] = [
            { content: 'How do I reset my password?', role: Role.User, createdAt: new Date(), loading: false },
            { content: 'I can help with that', role: Role.Assistant, createdAt: new Date(), loading: false },
            { content: 'Great, thanks', role: Role.User, createdAt: new Date(), loading: false },
            { content: undefined, role: Role.Assistant, createdAt: new Date(), loading: true }
        ];

        const hydrateMessages = jest.fn().mockReturnValue(mockMessages);

        const result = getMessagesForHydration(hydrateMessages);

        expect(result).toEqual(expect.objectContaining({
            initialMessages: [mockMessages[0], mockMessages[1]],
        }));
    });

    it('discards partial response when last message is from Copilot and is streaming', () => {
        const mockMessages: Message[] = [
            { content: 'How do I reset my password?', role: Role.User, createdAt: new Date(), loading: false, streaming: false },
            { content: 'I can help with that', role: Role.Assistant, createdAt: new Date(), loading: false, streaming: false },
            { content: 'Great, thanks', role: Role.User, createdAt: new Date(), loading: false, streaming: false },
            { content: 'I can see you are having trouble with your pa', role: Role.Assistant, createdAt: new Date(), loading: false, streaming: true }
        ];

        const hydrateMessages = jest.fn().mockReturnValue(mockMessages);

        const result = getMessagesForHydration(hydrateMessages);

        expect(result).toEqual(expect.objectContaining({
            initialMessages: [mockMessages[0], mockMessages[1]],
        }));
    });

    it('identifies user message to retry when last message is from Copilot and is loading', () => {
        const mockMessages: Message[] = [
            { content: 'How do I reset my password?', role: Role.User, createdAt: new Date(), loading: false },
            { content: 'I can help with that', role: Role.Assistant, createdAt: new Date(), loading: false },
            { content: 'Great, thanks', role: Role.User, createdAt: new Date(), loading: false },
            { content: undefined, role: Role.Assistant, createdAt: new Date(), loading: true }
        ];

        const hydrateMessages = jest.fn().mockReturnValue(mockMessages);

        const result = getMessagesForHydration(hydrateMessages);

        expect(result).toEqual(expect.objectContaining({
            messageToRetry: mockMessages[2],
        }));
    });

    it('identifies user message to retry when last message is from Copilot and is streaming', () => {
        const mockMessages: Message[] = [
            { content: 'How do I reset my password?', role: Role.User, createdAt: new Date(), loading: false, streaming: false },
            { content: 'I can help with that', role: Role.Assistant, createdAt: new Date(), loading: false, streaming: false },
            { content: 'Great, thanks', role: Role.User, createdAt: new Date(), loading: false, streaming: false },
            { content: 'I can see you are having trouble with your pa', role: Role.Assistant, createdAt: new Date(), loading: false, streaming: true }
        ];

        const hydrateMessages = jest.fn().mockReturnValue(mockMessages);

        const result = getMessagesForHydration(hydrateMessages);

        expect(result).toEqual(expect.objectContaining({
            messageToRetry: mockMessages[2],
        }));
    });


    it('identifies user message to retry when the last message is from the user', () => {
        const mockMessages: Message[] = [
            { content: 'Hello', role: Role.User, createdAt: new Date(), loading: false },
            { content: 'Hi there', role: Role.Assistant, createdAt: new Date(), loading: false },
            { content: 'How do I reset my password?', role: Role.User, createdAt: new Date(), loading: false }
        ];

        const hydrateMessages = jest.fn().mockReturnValue(mockMessages);

        const result = getMessagesForHydration(hydrateMessages);

        expect(result).toEqual({
            initialMessages: [
                mockMessages[0],
                mockMessages[1]
            ],
            messageToRetry: mockMessages[2]
        });
    });

    it('keeps complete conversation when no message requires a retry', () => {
        const mockMessages: Message[] = [
            { content: 'Hello', role: Role.User, createdAt: new Date(), loading: false },
            { content: 'Hi there', role: Role.Assistant, createdAt: new Date(), loading: false }
        ];

        const hydrateMessages = jest.fn().mockReturnValue(mockMessages);

        const result = getMessagesForHydration(hydrateMessages);

        expect(result).toEqual({
            initialMessages: [
                mockMessages[0],
                mockMessages[1]
            ],
            messageToRetry: undefined
        });
    });

    it('handles an empty message array', () => {
        const mockMessages: Message[] = [];

        const hydrateMessages = jest.fn().mockReturnValue(mockMessages);

        const result = getMessagesForHydration(hydrateMessages);

        expect(result).toEqual({
            initialMessages: [],
            messageToRetry: undefined
        });
    });
});
