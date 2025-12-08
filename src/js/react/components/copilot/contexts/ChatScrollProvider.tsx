// Based on https://github.com/github/github/blob/322faf420996c3debfd84a95294d93e87561a424/ui/packages/copilot-chat/components/ChatScrollContainer.tsx
import { clsx } from 'clsx'
import {
  createContext,
  type HTMLAttributes,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import * as styles from './ChatScrollProvider.module.css'

interface ChatScrollContextState {
  isScrolledUp: boolean
  scrollContainerHeight: string | undefined
  scrollToBottom: (behavior: ScrollBehavior) => void
}

const ChatScrollContext = createContext<ChatScrollContextState | null>(null)

type ScrollProviderProps = HTMLAttributes<HTMLDivElement> & {
  disabled?: boolean
}
/**
 * Functional container that handles auto-scroll on load and when new messages arrive. Provides context for
 * `useChatScroll`.
 */
export function ChatScrollProvider({ children, disabled, ...restProps }: ScrollProviderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  // Observe if scrolled to end
  const [isScrolledUp, setIsScrolledUp] = useState(false)
  useEffect(() => {
    const scrollObserver = new IntersectionObserver(([entry]) => setIsScrolledUp(!entry?.isIntersecting), {
      root: containerRef.current!,
      threshold: 0,
      // The margin means the user must be scrolled up more than 30px to be considered 'scrolled up'
      rootMargin: '30px'
    })

    scrollObserver.observe(endRef.current!)
    return () => scrollObserver.disconnect()
  }, [])

  // Track the inside height of the container (CSS `height` value string)
  const [scrollContainerHeight, setScrollContainerHeight] = useState<string>()
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return
      const computedStyles = getComputedStyle(containerRef.current)
      // using calc allows us to avoid parsing the values since it all stays in CSS
      const innerHeight = `calc(${containerRef.current.clientHeight}px - ${computedStyles.paddingTop} - ${computedStyles.paddingBottom})`
      setScrollContainerHeight(innerHeight)
    }
    const resizeObserver = new ResizeObserver(handleResize)

    handleResize()
    resizeObserver.observe(containerRef.current!)
    return () => resizeObserver.disconnect()
  }, [])

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior) => {
      if (disabled) return

      endRef.current?.scrollIntoView({ behavior, block: 'end' })
    },
    [disabled]
  )

  const contextValue = useMemo(
    () => ({ isScrolledUp, scrollToBottom, scrollContainerHeight }),
    [isScrolledUp, scrollToBottom, scrollContainerHeight]
  )

  return (
    <ChatScrollContext.Provider value={contextValue}>
      <div ref={containerRef} {...restProps} className={clsx(styles.container, restProps.className)}>
        {children}

        <div ref={endRef} style={{ height: '1px', marginTop: '-1px' }} />
      </div>
    </ChatScrollContext.Provider>
  )
}

/** Get scroll state & controls for the chat scroll container. If used outside of a container, will be a noop. */
export const useChatScroll = () => {
  const context = useContext(ChatScrollContext)
  if (!context) throw new Error('useChatScroll may only be called in a descendant of ChatScrollProvider')
  return context
}
