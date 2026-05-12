import { defineStore } from "pinia"

/**
 * Стор детей — полный CRUD: загрузка списка, создание, обновление, удаление.
 * Список держится в `items`, ошибки — в `fieldErrors` и `errorText`.
 *
 * Бэкенд возвращает paginated response { count, results, ... };
 * для админки достаточно работать с массивом — сразу разворачиваем results.
 */

export interface Child {
  id: number
  first_name: string
  last_name: string
  full_name: string
  birth_date: string | null
  parent_first_name: string
  parent_last_name: string
  parent_full_name: string
  parent_phone: string
  parent_telegram: string
  parent_vk: string
  center: number
  center_name: string
  monthly_fee: string  // DRF DecimalField сериализуется как строка
  is_active: boolean
  notes: string
  created_at: string
}

/** Поля, которые отправляются на бэк при create/update. */
export interface ChildInput {
  first_name: string
  last_name: string
  birth_date?: string | null
  parent_first_name: string
  parent_last_name?: string
  parent_phone: string
  parent_telegram?: string
  parent_vk?: string
  center: number
  monthly_fee?: string | number
  is_active?: boolean
  notes?: string
}

type FieldErrors = Record<string, string[]>

export const useChildrenStore = defineStore("children", () => {
  const items = ref<Child[]>([])
  const loading = ref<boolean>(false)
  const saving = ref<boolean>(false)
  const errorText = ref<string | null>(null)
  const fieldErrors = ref<FieldErrors>({})

  function resetErrors() {
    errorText.value = null
    fieldErrors.value = {}
  }

  async function fetchAll() {
    const { call } = useApi()
    loading.value = true
    resetErrors()
    try {
      const response = await call<{ results: Child[] } | Child[]>("/children/")
      items.value = Array.isArray(response) ? response : response.results
    } catch (e: any) {
      errorText.value = e?.message ?? "Не удалось загрузить детей"
    } finally {
      loading.value = false
    }
  }

  async function create(payload: ChildInput): Promise<Child | null> {
    const { call } = useApi()
    const toasts = useToastsStore()
    saving.value = true
    resetErrors()
    try {
      const created = await call<Child>("/children/", {
        method: "POST",
        body: payload,
      })
      items.value = [created, ...items.value]
      toasts.success(`Ребёнок «${created.full_name}» добавлен`)
      return created
    } catch (e: any) {
      handleApiError(e)
      toasts.error("Не удалось добавить ребёнка")
      return null
    } finally {
      saving.value = false
    }
  }

  async function update(id: number, payload: ChildInput): Promise<Child | null> {
    const { call } = useApi()
    const toasts = useToastsStore()
    saving.value = true
    resetErrors()
    try {
      const updated = await call<Child>(`/children/${id}/`, {
        method: "PUT",
        body: payload,
      })
      items.value = items.value.map((c) => (c.id === id ? updated : c))
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
      await call(`/children/${id}/`, { method: "DELETE" })
      items.value = items.value.filter((c) => c.id !== id)
      toasts.success("Ребёнок удалён")
      return true
    } catch (e: any) {
      errorText.value = e?.data?.detail ?? "Не удалось удалить ребёнка"
      toasts.error("Не удалось удалить")
      return false
    }
  }

  function handleApiError(e: any) {
    const data = e?.data
    if (data && typeof data === "object") {
      if (data.detail) {
        errorText.value = String(data.detail)
      } else {
        fieldErrors.value = data as FieldErrors
      }
    } else {
      errorText.value = "Не удалось сохранить"
    }
  }

  function fieldError(name: string): string | undefined {
    const arr = fieldErrors.value[name]
    return Array.isArray(arr) && arr.length ? arr[0] : undefined
  }

  return {
    items,
    loading,
    saving,
    errorText,
    fieldErrors,
    fetchAll,
    create,
    update,
    remove,
    resetErrors,
    fieldError,
  }
})
