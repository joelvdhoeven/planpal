import { useState, useCallback } from 'react'
import { parseDutchInput, formatDate, type ParsedEvent } from '../lib/date-parser'
import type { Message } from '../components/Chat/MessageList'
import { useCalendar } from './useCalendar'

const CONFIRMATION_WORDS = ['ja', 'ok', 'oké', 'okay', 'klopt', 'yes', 'jep', 'yep', 'doe maar']
const REJECTION_WORDS = ['nee', 'no', 'niet', 'annuleer', 'stop', 'cancel']

function isConfirmation(input: string): boolean {
  const lower = input.toLowerCase().trim()
  return CONFIRMATION_WORDS.some((word) => lower === word || lower.startsWith(word + ' '))
}

function isRejection(input: string): boolean {
  const lower = input.toLowerCase().trim()
  return REJECTION_WORDS.some((word) => lower === word || lower.startsWith(word + ' '))
}

function createStartTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number)
  const startTime = new Date(date)
  startTime.setHours(hours, minutes, 0, 0)
  return startTime
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [pendingEvent, setPendingEvent] = useState<ParsedEvent | null>(null)
  const { createEvent, loading: calendarLoading, error: calendarError } = useCalendar()

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

  const handleConfirmation = useCallback(async () => {
    if (!pendingEvent) return

    const startTime = createStartTime(pendingEvent.date, pendingEvent.time)
    const result = await createEvent(pendingEvent.title, startTime)

    if (result) {
      const formattedDate = formatDate(pendingEvent.date)
      addMessage(
        'assistant',
        `✅ ${pendingEvent.title} is ingepland op ${formattedDate} om ${pendingEvent.time}!\n\n🔗 ${result.htmlLink}`
      )
    } else {
      addMessage(
        'assistant',
        `❌ Er ging iets mis bij het inplannen: ${calendarError || 'Onbekende fout'}. Probeer het opnieuw.`
      )
    }

    setPendingEvent(null)
  }, [pendingEvent, createEvent, calendarError, addMessage])

  const handleRejection = useCallback(() => {
    setPendingEvent(null)
    addMessage('assistant', 'Oké, ik heb het geannuleerd. Wat wil je inplannen?')
  }, [addMessage])

  const sendMessage = useCallback(
    async (content: string) => {
      addMessage('user', content)

      // If there's a pending event awaiting confirmation
      if (pendingEvent) {
        if (isConfirmation(content)) {
          await handleConfirmation()
          return
        }
        if (isRejection(content)) {
          handleRejection()
          return
        }
        // User sent something else, treat as new input
        setPendingEvent(null)
      }

      // Parse the input for a new event
      const parsed = parseDutchInput(content)

      if (parsed) {
        const formattedDate = formatDate(parsed.date)
        const response = `Ik ga "${parsed.title}" inplannen op ${formattedDate} om ${parsed.time}. Klopt dit?`
        addMessage('assistant', response)
        setPendingEvent(parsed)
      } else {
        const response =
          'Ik kon geen datum vinden. Probeer bijv: "morgen om 14:00 meeting" of "volgende week maandag vergadering"'
        addMessage('assistant', response)
      }
    },
    [addMessage, pendingEvent, handleConfirmation, handleRejection]
  )

  const clearMessages = useCallback(() => {
    setMessages([])
    setPendingEvent(null)
  }, [])

  return {
    messages,
    sendMessage,
    clearMessages,
    isProcessing: calendarLoading,
  }
}

export type { Message }
