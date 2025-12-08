import React from 'react';
import { createRoot } from 'react-dom/client';
import { CopilotChatWidget } from './components/copilot/CopilotChatWidget';
import { ConversationProvider } from './components/copilot/contexts/ConversationProvider';
import { ThemeProvider, BaseStyles } from '@primer/react'
import '@primer/primitives/dist/css/functional/themes/dark.css'
import '@primer/primitives/dist/css/functional/themes/light.css'
import '@primer/primitives/dist/css/base/size/size.css'
import '@primer/primitives/dist/css/base/typography/typography.css'
import '@primer/primitives/dist/css/functional/size/border.css'
import '@primer/primitives/dist/css/functional/size/breakpoints.css'
import '@primer/primitives/dist/css/functional/size/size.css'
import '@primer/primitives/dist/css/functional/size/viewport.css'
import '@primer/primitives/dist/css/functional/typography/typography.css'
import '@primer/primitives/dist/css/base/motion/motion.css'

const getHtmlColorScheme = (): 'light' | 'dark' | 'auto' => {
  if (new URL(window.location.href).pathname === "/") {
    return "dark";
  }
  return (document?.documentElement.style.colorScheme as 'light' | 'dark' | 'auto') ?? 'light';
};


(() => {
  const WIDGET_CONTAINER_ID = 'github-copilot-widget-container';

  const initWidget = (): void => {
    if (document.getElementById(WIDGET_CONTAINER_ID)) return; // Prevent double init
    const widgetContainer = document.createElement('div');
    widgetContainer.id = WIDGET_CONTAINER_ID;
    document.body.appendChild(widgetContainer);

    // React state for colorMode and home page detection
    const ColorModeWrapper: React.FC = () => {
      const [colorMode, setColorMode] = React.useState<'light' | 'dark' | 'auto'>(getHtmlColorScheme());

      React.useEffect(() => {
        const handler = (e: Event) => {
          if (e instanceof CustomEvent && e.type === 'themechange' && e.detail?.theme) {
            setColorMode(e.detail.theme);
          }
        };
        window.addEventListener('themechange', handler);
        return () => window.removeEventListener('themechange', handler);
      }, []);

      return (
        <ThemeProvider colorMode={colorMode}>
          <BaseStyles>
            <ConversationProvider>
              <CopilotChatWidget />
            </ConversationProvider>
          </BaseStyles>
        </ThemeProvider>
      );
    };

    const root = createRoot(widgetContainer);
    root.render(<ColorModeWrapper />);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
