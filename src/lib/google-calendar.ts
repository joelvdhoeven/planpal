export interface CalendarEvent {
  title: string
  startTime: Date
  endTime: Date
}

export interface CalendarEventResponse {
  id: string
  htmlLink: string
  summary: string
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
}

export interface CalendarError {
  error: {
    code: number
    message: string
    status: string
  }
}

function isCalendarError(response: unknown): response is CalendarError {
  return (
    typeof response === 'object' &&
    response !== null &&
    'error' in response &&
    typeof (response as CalendarError).error === 'object'
  )
}

export async function createCalendarEvent(
  accessToken: string,
  event: CalendarEvent
): Promise<CalendarEventResponse> {
  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: event.title,
        start: {
          dateTime: event.startTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: event.endTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      }),
    }
  )

  const data: CalendarEventResponse | CalendarError = await response.json()

  if (!response.ok || isCalendarError(data)) {
    const errorMessage = isCalendarError(data)
      ? data.error.message
      : 'Failed to create calendar event'
    throw new Error(errorMessage)
  }

  return data
}
