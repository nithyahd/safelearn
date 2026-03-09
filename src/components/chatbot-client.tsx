"use client";

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

/**
 * A client-side wrapper for the AIChatbot component.
 * This handles the 'ssr: false' dynamic import and defers mounting 
 * to ensure it doesn't block initial page rendering.
 */
const DynamicChatbot = dynamic(() => import("@/components/ai-chatbot").then(mod => mod.AIChatbot), {
  ssr: false,
});

export function ChatbotClient() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Delay chatbot mounting until the browser is idle or after a 3s timeout
    // This prioritizes the main page content for Lighthouse performance scores.
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 3000);

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        setShouldRender(true);
        clearTimeout(timer);
      });
    }

    return () => clearTimeout(timer);
  }, []);

  if (!shouldRender) return null;

  return <DynamicChatbot />;
}
