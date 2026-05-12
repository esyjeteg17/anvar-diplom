import { defineStore } from "pinia"

/**
 * Стор центров. В рамках админ-панели центры используются как справочник —
 * в формах детей/занятий нужен select со списком центров.
 *
 * Полный CRUD по центрам также можно сделать на отдельной странице,
 * но 4 центра редко меняются — их можно править через Django admin.
 */

export interface Center {
  id: number
  name: string
  address: string
  lat: number | null
  lng: number | null
  is_active: boolean
}

export const useCentersStore = defineStore("centers", () => {
  const items = ref<Center[]>([])
  const loading = ref<boolean>(false)
  const errorText = ref<string | null>(null)

  /** Список как массив { value, label } для SelectField. */
  const options = computed<Array<{ value: number; label: string }>>(() =>
    items.value
      .filter((c) => c.is_active)
      .map((c) => ({ value: c.id, label: c.name })),
  )

  async function fetchAll() {
    if (items.value.length > 0) return // простое кеширование
    const { call } = useApi()
    loading.value = true
    errorText.value = null
    try {
      const response = await call<{ results: Center[] } | Center[]>("/centers/")
      items.value = Array.isArray(response) ? response : response.results
    } catch (e: any) {
      errorText.value = e?.message ?? "Не удалось загрузить центры"
    } finally {
      loading.value = false
    }
  }

  return { items, loading, errorText, options, fetchAll }
})
