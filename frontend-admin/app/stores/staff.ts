import { defineStore } from "pinia"

/**
 * Стор сотрудников. Полный CRUD: используется на странице финансов
 * (зарплаты сотрудников) и на странице расписания (выбор преподавателя).
 */

export interface Staff {
  id: number
  first_name: string
  last_name: string
  full_name: string
  role: "teacher" | "manager" | "admin" | "other"
  phone: string
  email: string
  salary_per_month: string
  hire_date: string | null
  is_active: boolean
}

export interface StaffInput {
  first_name: string
  last_name: string
  role: Staff["role"]
  phone?: string
  email?: string
  salary_per_month?: string | number
  hire_date?: string | null
  is_active?: boolean
}

type FieldErrors = Record<string, string[]>

/** Удобный список ролей для select. */
export const STAFF_ROLES: Array<{ value: Staff["role"]; label: string }> = [
  { value: "teacher", label: "Преподаватель" },
  { value: "manager", label: "Менеджер" },
  { value: "admin",   label: "Администратор" },
  { value: "other",   label: "Другое" },
]

export const useStaffStore = defineStore("staff", () => {
  const items = ref<Staff[]>([])
  const loading = ref<boolean>(false)
  const saving = ref<boolean>(false)
  const errorText = ref<string | null>(null)
  const fieldErrors = ref<FieldErrors>({})

  /** Только активные преподаватели — для select на странице расписания. */
  const teacherOptions = computed<Array<{ value: number; label: string }>>(() =>
    items.value
      .filter((s) => s.is_active && s.role === "teacher")
      .map((s) => ({ value: s.id, label: s.full_name })),
  )

  function resetErrors() {
    errorText.value = null
    fieldErrors.value = {}
  }

  function fieldError(name: string): string | undefined {
    const arr = fieldErrors.value[name]
    return Array.isArray(arr) && arr.length ? arr[0] : undefined
  }

  async function fetchAll(force = false) {
    if (!force && items.value.length > 0) return
    const { call } = useApi()
    loading.value = true
    resetErrors()
    try {
      const response = await call<{ results: Staff[] } | Staff[]>("/staff/")
      items.value = Array.isArray(response) ? response : response.results
    } catch (e: any) {
      errorText.value = e?.message ?? "Не удалось загрузить сотрудников"
    } finally {
      loading.value = false
    }
  }

  async function create(payload: StaffInput): Promise<Staff | null> {
    const { call } = useApi()
    const toasts = useToastsStore()
    saving.value = true
    resetErrors()
    try {
      const created = await call<Staff>("/staff/", { method: "POST", body: payload })
      items.value = [created, ...items.value]
      toasts.success(`Сотрудник «${created.full_name}» добавлен`)
      return created
    } catch (e: any) {
      handleApiError(e)
      toasts.error("Не удалось добавить сотрудника")
      return null
    } finally {
      saving.value = false
    }
  }

  async function update(id: number, payload: StaffInput): Promise<Staff | null> {
    const { call } = useApi()
    const toasts = useToastsStore()
    saving.value = true
    resetErrors()
    try {
      const updated = await call<Staff>(`/staff/${id}/`, {
        method: "PUT",
        body: payload,
      })
      items.value = items.value.map((s) => (s.id === id ? updated : s))
      toasts.success(`«${updated.full_name}» обновлён`)
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
      await call(`/staff/${id}/`, { method: "DELETE" })
      items.value = items.value.filter((s) => s.id !== id)
      toasts.success("Сотрудник удалён")
      return true
    } catch (e: any) {
      errorText.value = e?.data?.detail ?? "Не удалось удалить сотрудника"
      toasts.error("Не удалось удалить")
      return false
    }
  }

  function handleApiError(e: any) {
    const data = e?.data
    if (data && typeof data === "object") {
      if (data.detail) errorText.value = String(data.detail)
      else fieldErrors.value = data as FieldErrors
    } else {
      errorText.value = "Не удалось сохранить"
    }
  }

  return {
    items,
    loading,
    saving,
    errorText,
    fieldErrors,
    teacherOptions,
    fetchAll,
    create,
    update,
    remove,
    resetErrors,
    fieldError,
  }
})
