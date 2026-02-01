export interface ParsedEvent {
  date: Date
  time: string
  title: string
}

const DUTCH_DAYS: Record<string, number> = {
  zondag: 0,
  maandag: 1,
  dinsdag: 2,
  woensdag: 3,
  donderdag: 4,
  vrijdag: 5,
  zaterdag: 6,
}

const DUTCH_MONTHS: Record<string, number> = {
  januari: 0,
  februari: 1,
  maart: 2,
  april: 3,
  mei: 4,
  juni: 5,
  juli: 6,
  augustus: 7,
  september: 8,
  oktober: 9,
  november: 10,
  december: 11,
  jan: 0,
  feb: 1,
  mrt: 2,
  apr: 3,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  okt: 9,
  nov: 10,
  dec: 11,
}

function getNextDayOfWeek(dayIndex: number, nextWeek: boolean = false): Date {
  const today = new Date()
  const currentDay = today.getDay()
  let daysUntil = dayIndex - currentDay

  if (daysUntil <= 0 || nextWeek) {
    daysUntil += 7
  }

  const result = new Date(today)
  result.setDate(today.getDate() + daysUntil)
  return result
}

function parseDate(input: string): Date | null {
  const lowerInput = input.toLowerCase()

  // "vandaag"
  if (lowerInput.includes('vandaag')) {
    return new Date()
  }

  // "morgen"
  if (lowerInput.includes('morgen') && !lowerInput.includes('overmorgen')) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow
  }

  // "overmorgen"
  if (lowerInput.includes('overmorgen')) {
    const dayAfterTomorrow = new Date()
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)
    return dayAfterTomorrow
  }

  // "volgende week maandag", etc.
  const nextWeekMatch = lowerInput.match(/volgende\s+week\s+(\w+)/)
  if (nextWeekMatch) {
    const dayName = nextWeekMatch[1]
    if (dayName in DUTCH_DAYS) {
      return getNextDayOfWeek(DUTCH_DAYS[dayName], true)
    }
  }

  // Day names: "maandag", "dinsdag", etc.
  for (const [dayName, dayIndex] of Object.entries(DUTCH_DAYS)) {
    if (lowerInput.includes(dayName)) {
      return getNextDayOfWeek(dayIndex)
    }
  }

  // Date formats: "15 januari", "3 feb"
  const dateMatch = lowerInput.match(/(\d{1,2})\s+(\w+)/)
  if (dateMatch) {
    const day = parseInt(dateMatch[1], 10)
    const monthName = dateMatch[2]
    if (monthName in DUTCH_MONTHS) {
      const result = new Date()
      result.setMonth(DUTCH_MONTHS[monthName], day)
      // If the date has passed this year, move to next year
      if (result < new Date()) {
        result.setFullYear(result.getFullYear() + 1)
      }
      return result
    }
  }

  return null
}

function parseTime(input: string): string | null {
  const lowerInput = input.toLowerCase()

  // "om 14:00", "om 9:30"
  const timeMatch = lowerInput.match(/om\s+(\d{1,2}):(\d{2})/)
  if (timeMatch) {
    const hours = timeMatch[1].padStart(2, '0')
    const minutes = timeMatch[2]
    return `${hours}:${minutes}`
  }

  // "om 14 uur", "om 9 uur"
  const hourOnlyMatch = lowerInput.match(/om\s+(\d{1,2})\s*uur/)
  if (hourOnlyMatch) {
    const hours = hourOnlyMatch[1].padStart(2, '0')
    return `${hours}:00`
  }

  // "om half 3" (= 14:30)
  const halfMatch = lowerInput.match(/om\s+half\s+(\d{1,2})/)
  if (halfMatch) {
    let hours = parseInt(halfMatch[1], 10) - 1
    if (hours < 0) hours = 23
    // Assume afternoon if hour < 7
    if (hours < 7) hours += 12
    return `${hours.toString().padStart(2, '0')}:30`
  }

  // "'s ochtends" (default 9:00)
  if (lowerInput.includes("'s ochtends") || lowerInput.includes('s ochtends')) {
    return '09:00'
  }

  // "'s middags" (default 14:00)
  if (lowerInput.includes("'s middags") || lowerInput.includes('s middags')) {
    return '14:00'
  }

  // "'s avonds" (default 19:00)
  if (lowerInput.includes("'s avonds") || lowerInput.includes('s avonds')) {
    return '19:00'
  }

  return null
}

function extractTitle(input: string): string {
  // Remove date/time patterns to get the title
  const title = input
    .replace(/om\s+\d{1,2}:\d{2}/gi, '')
    .replace(/om\s+\d{1,2}\s*uur/gi, '')
    .replace(/om\s+half\s+\d{1,2}/gi, '')
    .replace(/'s\s*ochtends/gi, '')
    .replace(/s\s*ochtends/gi, '')
    .replace(/'s\s*middags/gi, '')
    .replace(/s\s*middags/gi, '')
    .replace(/'s\s*avonds/gi, '')
    .replace(/s\s*avonds/gi, '')
    .replace(/\bvandaag\b/gi, '')
    .replace(/\bovermorgen\b/gi, '')
    .replace(/\bmorgen\b/gi, '')
    .replace(/volgende\s+week\s+\w+/gi, '')
    .replace(/\b(maandag|dinsdag|woensdag|donderdag|vrijdag|zaterdag|zondag)\b/gi, '')
    .replace(/\d{1,2}\s+(januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december|jan|feb|mrt|apr|jun|jul|aug|sep|okt|nov|dec)/gi, '')
    .replace(/\s+/g, ' ')
    .trim()

  return title || 'Nieuw event'
}

export function parseDutchInput(input: string): ParsedEvent | null {
  const date = parseDate(input)

  if (!date) {
    return null
  }

  const time = parseTime(input) || '12:00'
  const title = extractTitle(input)

  return {
    date,
    time,
    title,
  }
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
