import { defineStore } from "pinia"

/**
 * Стор оборудования. Простой счётчик: 3 типа, у каждого — quantity.
 * Список тащим один раз, кнопки +1/−1 ходят в action /adjust/ —
 * бэк вернёт обновлённую запись, мы её сразу подменяем в списке.
 */

export type EquipmentType = "set" | "tablet" | "stand"

export interface Equipment {
  id: number
  type: EquipmentType
  type_display: string
  quantity: number
  updated_at: string
}

/** Список типов в порядке отображения на странице. */
export const EQUIPMENT_TYPES: Array<{
  value: EquipmentType
  label: string
}> = [
  { value: "set",    label: "Наборы-конструкторы" },
  { value: "tablet", label: "Планшеты" },
  { value: "stand",  label: "Подставки" },
]

export const useEquipmentStore = defineStore("equipment", () => {
  const items = ref<Equipment[]>([])
  const loading = ref<boolean>(false)
  const errorText = ref<string | null>(null)

  /** Сумма по всем типам — для большой карточки «Всего единиц». */
  const grandTotal = computed<number>(() =>
    items.value.reduce((acc, it) => acc + it.quantity, 0),
  )

  /** Удобный поиск записи по типу. */
  function findByType(type: EquipmentType): Equipment | undefined {
    return items.value.find((it) => it.type === type)
  }

  async function fetchAll() {
    const { call } = useApi()
    loading.value = true
    errorText.value = null
    try {
      const response = await call<{ results: Equipment[] } | Equipment[]>("/equipment/")
      items.value = Array.isArray(response) ? response : response.results
    } catch (e: any) {
      errorText.value = e?.message ?? "Не удалось загрузить оборудование"
    } finally {
      loading.value = false
    }
  }

  /**
   * Скорректировать количество на delta (например, +1 / −1).
   * После ответа бэка обновляем локальную запись, чтобы UI среагировал сразу.
   */
  async function adjust(type: EquipmentType, delta: number): Promise<void> {
    const { call } = useApi()
    const toasts = useToastsStore()
    try {
      const updated = await call<Equipment>("/equipment/adjust/", {
        method: "POST",
        body: { type, delta },
      })
      const idx = items.value.findIndex((it) => it.type === type)
      if (idx >= 0) items.value[idx] = updated
      else items.value.push(updated)
    } catch {
      toasts.error("Не удалось обновить количество")
    }
  }

  return {
    items,
    loading,
    errorText,
    grandTotal,
    findByType,
    fetchAll,
    adjust,
  }
})
