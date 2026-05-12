/**
 * useDate — набор чистых функций для работы с датами.
 *
 * Используем обычный JS Date, чтобы не подключать dayjs/date-fns —
 * для нужд расписания (понедельник недели, +N дней, форматирование) этого хватает.
 *
 * Все функции иммутабельные: оригинальный Date никогда не изменяется.
 */

const RU_WEEKDAYS_FULL = [
  "Воскресенье", "Понедельник", "Вторник", "Среда",
  "Четверг", "Пятница", "Суббота",
] as const

const RU_WEEKDAYS_SHORT = [
  "Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб",
] as const

const RU_MONTHS_GENITIVE = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
] as const

/** Понедельник той недели, к которой относится дата (00:00 локально). */
export function startOfWeek(d: Date): Date {
  const result = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  // getDay(): 0 = Вс, 1 = Пн, ..., 6 = Сб → нам нужно сместить так, чтобы Пн = 0.
  const diff = (result.getDay() + 6) % 7
  result.setDate(result.getDate() - diff)
  return result
}

/** Дата, сдвинутая на N дней (отрицательное значение — назад). */
export function addDays(d: Date, days: number): Date {
  const r = new Date(d)
  r.setDate(r.getDate() + days)
  return r
}

/** Сегодня в 00:00 локального времени — для сравнения с другими датами по дню. */
export function todayLocal(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

/** Форматирование в YYYY-MM-DD (формат бэкенда). */
export function formatYmd(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

/** «7 мая 2026» */
export function formatHumanDate(d: Date): string {
  return `${d.getDate()} ${RU_MONTHS_GENITIVE[d.getMonth()]} ${d.getFullYear()}`
}

/** «Пн» / «Вт» */
export function shortWeekday(d: Date): string {
  return RU_WEEKDAYS_SHORT[d.getDay()]!
}

/** «Понедельник» / «Вторник» */
export function fullWeekday(d: Date): string {
  return RU_WEEKDAYS_FULL[d.getDay()]!
}

/** Совпадает ли год+месяц+день у двух дат. */
export function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/** Парсинг YYYY-MM-DD в локальный Date (00:00). */
export function parseYmd(s: string): Date {
  const [y, m, d] = s.split("-").map(Number)
  return new Date(y!, (m ?? 1) - 1, d ?? 1)
}
