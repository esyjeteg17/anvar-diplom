import { defineStore } from "pinia"

/**
 * Стор заявок — отвечает за отправку формы обратной связи на бэкенд (Django+DRF).
 *
 * Хранит:
 *   - текущее состояние отправки (loading);
 *   - последнюю ошибку, чтобы показать рядом с формой;
 *   - флаг успеха, чтобы после успешной отправки заменить форму на «Спасибо».
 *
 * Сами поля формы — в локальном состоянии компонента ContactsForm,
 * стор хранит только sticky-результат отправки.
 */

export interface LeadInput {
  name: string
  phone: string
  message?: string
  source?: string
  promo_code?: string
}

/** Ответ от бэкенда при ошибке валидации DRF: { fieldName: ["сообщение", ...] } */
type FieldErrors = Record<string, string[]>

export const useLeadsStore = defineStore("leads", () => {
  const loading = ref<boolean>(false)
  const success = ref<boolean>(false)
  const errorText = ref<string | null>(null)
  const fieldErrors = ref<FieldErrors>({})

  /** Сбросить состояние перед новой отправкой / при размонтировании. */
  function reset() {
    loading.value = false
    success.value = false
    errorText.value = null
    fieldErrors.value = {}
  }

  /**
   * Отправить заявку на бэкенд.
   * Возвращает true при успехе и false при любой ошибке (валидация / сеть).
   * Конкретные ошибки лежат в fieldErrors / errorText.
   */
  async function submit(payload: LeadInput): Promise<boolean> {
    const config = useRuntimeConfig()
    loading.value = true
    success.value = false
    errorText.value = null
    fieldErrors.value = {}

    try {
      await $fetch(`${config.public.apiBase}/leads/`, {
        method: "POST",
        body: payload,
      })
      success.value = true
      return true
    } catch (e: any) {
      // Nuxt $fetch при не-2xx бросает FetchError с .data — это тело ответа DRF.
      const data = e?.data
      if (data && typeof data === "object") {
        // DRF возвращает либо {field: [errors]}, либо {detail: "..."}.
        if (data.detail) {
          errorText.value = String(data.detail)
        } else {
          fieldErrors.value = data as FieldErrors
        }
      } else {
        errorText.value = "Не удалось отправить заявку. Попробуйте позже."
      }
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    success,
    errorText,
    fieldErrors,
    submit,
    reset,
  }
})
