import { useState, useCallback } from 'react'
import { useAuth } from './useAuth'
import {
  createCalendarEvent,
  type CalendarEvent,
  type CalendarEventResponse,
} from '../lib/google-calendar'

const DEFAULT_EVENT_DURATION_MS = 60 * 60 * 1000 // 1 hour

export function useCalendar() {
  const { session } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createEvent = useCallback(
    async (
      title: string,
      startTime: Date,
      endTime?: Date
    ): Promise<CalendarEventResponse | null> => {
      const accessToken = session?.provider_token

      if (!accessToken) {
        setError('Geen toegang tot Google Calendar. Log opnieuw in.')
        return null
      }

      setLoading(true)
      setError(null)

      const event: CalendarEvent = {
        title,
        startTime,
        endTime: endTime ?? new Date(startTime.getTime() + DEFAULT_EVENT_DURATION_MS),
      }

      try {
        const result = await createCalendarEvent(accessToken, event)
        return result
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Onbekende fout bij aanmaken event'
        setError(message)
        return null
      } finally {
        setLoading(false)
      }
    },
    [session]
  )

  return {
    createEvent,
    loading,
    error,
  }
}
