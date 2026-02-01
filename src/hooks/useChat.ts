import { useState, useCallback } from 'react'
import { parseDutchInput, formatDate } from '../lib/date-parser'
import type { Message } from '../components/Chat/MessageList'

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])

  const addMessage = useCallback((role: 'user' | 'assistant', content: string) => {
    const message: Message = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, message])
    return message
  }, [])

  const sendMessage = useCallback(
    (content: string) => {
      // Add user message
      addMessage('user', content)

      // Parse the input
      const parsed = parseDutchInput(content)

      if (parsed) {
        const formattedDate = formatDate(parsed.date)
        const response = `Ik ga "${parsed.title}" inplannen op ${formattedDate} om ${parsed.time}. Klopt dit?`
        addMessage('assistant', response)
      } else {
        const response =
          'Ik kon geen datum vinden. Probeer bijv: "morgen om 14:00 meeting" of "volgende week maandag vergadering"'
        addMessage('assistant', response)
      }
    },
    [addMessage]
  )

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    sendMessage,
    clearMessages,
  }
}

export type { Message }
