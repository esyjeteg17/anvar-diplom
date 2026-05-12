import { defineStore } from "pinia"

/**
 * Стор занятий. Загрузка по периоду (date_from/date_to), CRUD занятий
 * и CRUD посещаемости (attendance) — на одной странице удобнее держать вместе.
 *
 * Сначала загружаем все занятия за выбранную неделю, занятие тащит за собой
 * вложенный список attendances (см. LessonSerializer на бэке) — без лишних запросов.
 */

export interface Attendance {
  id: number
  lesson: number
  child: number
  child_full_name: string
  present: boolean
  comment: string
}

export interface Lesson {
  id: number
  center: number
  center_name: string
  teacher: number | null
  teacher_name: string
  date: string  // YYYY-MM-DD
  start_time: string  // HH:MM:SS
  duration_min: number
  topic: string
  description: string
  conducted: boolean
  attendances: Attendance[]
  created_at: string
}

export interface LessonInput {
  center: number
  teacher?: number | null
  date: string
  start_time: string
  duration_min?: number
  topic?: string
  description?: string
  conducted?: boolean
}

export interface AttendanceInput {
  lesson: number
  child: number
  present: boolean
  comment?: string
}

type FieldErrors = Record<string, string[]>

export const useLessonsStore = defineStore("lessons", () => {
  const items = ref<Lesson[]>([])
  const loading = ref<boolean>(false)
  const saving = ref<boolean>(false)
  const errorText = ref<string | null>(null)
  const fieldErrors = ref<FieldErrors>({})

  function resetErrors() {
    errorText.value = null
    fieldErrors.value = {}
  }

  function fieldError(name: string): string | undefined {
    const arr = fieldErrors.value[name]
    return Array.isArray(arr) && arr.length ? arr[0] : undefined
  }

  /** Загрузка занятий за период. Перезаписывает items. */
  async function fetchPeriod(date_from: string, date_to: string) {
    const { call } = useApi()
    loading.value = true
    resetErrors()
    try {
      const response = await call<{ results: Lesson[] } | Lesson[]>(
        `/lessons/?date_from=${date_from}&date_to=${date_to}`,
      )
      items.value = Array.isArray(response) ? response : response.results
    } catch (e: any) {
      errorText.value = e?.message ?? "Не удалось загрузить занятия"
    } finally {
      loading.value = false
    }
  }

  async function create(payload: LessonInput): Promise<Lesson | null> {
    const { call } = useApi()
    const toasts = useToastsStore()
    saving.value = true
    resetErrors()
    try {
      const created = await call<Lesson>("/lessons/", {
        method: "POST",
        body: payload,
      })
      items.value = [...items.value, created]
      toasts.success("Занятие создано")
      return created
    } catch (e: any) {
      handleApiError(e)
      toasts.error("Не удалось создать занятие")
      return null
    } finally {
      saving.value = false
    }
  }

  async function update(id: number, payload: LessonInput): Promise<Lesson | null> {
    const { call } = useApi()
    const toasts = useToastsStore()
    saving.value = true
    resetErrors()
    try {
      const updated = await call<Lesson>(`/lessons/${id}/`, {
        method: "PUT",
        body: payload,
      })
      // Сохраняем старые attendances, потому что бэк их не возвращает в body PUT-а Lesson
      // (но возвращает — мы используем тот же сериализатор). На всякий случай мерджим.
      items.value = items.value.map((l) => (l.id === id ? { ...l, ...updated } : l))
      toasts.success("Занятие обновлено")
      return updated
    } catch (e: any) {
      handleApiError(e)
      toasts.error("Не удалось сохранить изменения")
      return null
    } finally {
      saving.value = false
    }
  }

  async function remove(id: number): Promise<boolean> {
    const { call } = useApi()
    const toasts = useToastsStore()
    resetErrors()
    try {
      await call(`/lessons/${id}/`, { method: "DELETE" })
      items.value = items.value.filter((l) => l.id !== id)
      toasts.success("Занятие удалено")
      return true
    } catch (e: any) {
      errorText.value = e?.data?.detail ?? "Не удалось удалить занятие"
      toasts.error("Не удалось удалить")
      return false
    }
  }

  /**
   * Сохранить посещение. Если у этого ребёнка на этом занятии уже есть запись —
   * обновляем (PUT по id), иначе создаём (POST). Локально кладём результат
   * в lesson.attendances, чтобы UI видел изменения сразу.
   */
  async function saveAttendance(payload: AttendanceInput): Promise<Attendance | null> {
    const { call } = useApi()
    const lesson = items.value.find((l) => l.id === payload.lesson)
    const existing = lesson?.attendances.find((a) => a.child === payload.child)

    try {
      const saved = existing
        ? await call<Attendance>(`/lessons/attendance/${existing.id}/`, {
            method: "PUT",
            body: payload,
          })
        : await call<Attendance>("/lessons/attendance/", {
            method: "POST",
            body: payload,
          })

      if (lesson) {
        const idx = lesson.attendances.findIndex((a) => a.child === saved.child)
        if (idx >= 0) lesson.attendances[idx] = saved
        else lesson.attendances.push(saved)
      }
      return saved
    } catch (e: any) {
      errorText.value = e?.data?.detail ?? "Не удалось сохранить посещение"
      return null
    }
  }

  function handleApiError(e: any) {
    const data = e?.data
    if (data && typeof data === "object") {
      if (data.detail) errorText.value = String(data.detail)
      else fieldErrors.value = data as FieldErrors
    } else {
      errorText.value = "Не удалось сохранить занятие"
    }
  }

  return {
    items,
    loading,
    saving,
    errorText,
    fieldErrors,
    fetchPeriod,
    create,
    update,
    remove,
    saveAttendance,
    resetErrors,
    fieldError,
  }
})
