import { defineStore } from "pinia"

/**
 * Стор «намерений» подачи заявки.
 * Связывает квиз и форму контактов: после прохождения квиза кладём
 * сюда промокод и источник, форма ContactsForm при монтировании
 * читает их и подставляет в отправляемый payload.
 *
 * После успешной отправки заявки очищаем — следующая подача формы
 * стартует с чистого состояния.
 */

export const useLeadIntentStore = defineStore("leadIntent", () => {
  const promoCode = ref<string | null>(null)
  const source = ref<string>("landing/form")

  function prefill(opts: { promoCode?: string | null; source?: string }) {
    if (opts.promoCode !== undefined) promoCode.value = opts.promoCode
    if (opts.source !== undefined) source.value = opts.source
  }

  function clear() {
    promoCode.value = null
    source.value = "landing/form"
  }

  return { promoCode, source, prefill, clear }
})
