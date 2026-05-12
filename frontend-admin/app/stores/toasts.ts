import { defineStore } from "pinia"

/**
 * Стор toast-уведомлений админки.
 *
 * push() добавляет тост и автоматически снимает его через `duration` мс.
 * Компонент <ToastContainer /> подписан на список и рендерит их в углу.
 *
 * Используется из любых сторов и страниц через короткие хелперы:
 *   const toasts = useToastsStore()
 *   toasts.success("Сохранено")
 *   toasts.error("Не получилось")
 */

export type ToastTone = "success" | "error" | "info"

export interface Toast {
  id: number
  tone: ToastTone
  text: string
}

export const useToastsStore = defineStore("toasts", () => {
  const items = ref<Toast[]>([])
  let nextId = 1

  function push(tone: ToastTone, text: string, duration = 3500): number {
    const id = nextId++
    items.value.push({ id, tone, text })
    if (typeof window !== "undefined") {
      setTimeout(() => remove(id), duration)
    }
    return id
  }

  function success(text: string, duration?: number): number {
    return push("success", text, duration)
  }

  function error(text: string, duration?: number): number {
    return push("error", text, duration)
  }

  function info(text: string, duration?: number): number {
    return push("info", text, duration)
  }

  function remove(id: number) {
    items.value = items.value.filter((t) => t.id !== id)
  }

  return { items, push, success, error, info, remove }
})
