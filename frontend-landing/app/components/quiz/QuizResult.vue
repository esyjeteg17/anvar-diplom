<script setup lang="ts">
/**
 * Финальный экран квиза: поздравление, промокод с кнопкой «Скопировать»
 * и CTA на запись + возможность пройти квиз заново.
 *
 * При нажатии «Записаться на занятие» промокод сохраняется в leadIntent
 * стор — форма контактов подхватит его и пришлёт в Django вместе с заявкой.
 */

import { useLeadIntentStore } from "~/stores/leadIntent"

const props = defineProps<{
  /** Промокод, полученный пользователем */
  code: string
}>()

const emit = defineEmits<{
  (e: "reset"): void
}>()

const leadIntent = useLeadIntentStore()

/**
 * Заполняем намерение перед прокруткой к форме. После клика по кнопке
 * браузер сразу прыгнет к якорю #contacts (href остаётся на кнопке),
 * форма успеет смонтироваться с подставленными данными.
 */
function applyPromoToForm() {
  leadIntent.prefill({ promoCode: props.code, source: "landing/quiz" })
}

// Вспомогательное состояние для UX-фидбэка кнопки «Скопировать».
const copied = ref<boolean>(false)
let resetTimer: ReturnType<typeof setTimeout> | null = null

async function copyCode(code: string) {
  try {
    await navigator.clipboard.writeText(code)
    copied.value = true
    if (resetTimer) clearTimeout(resetTimer)
    resetTimer = setTimeout(() => (copied.value = false), 1800)
  } catch {
    // Если буфер недоступен — просто выделим текст, пользователь скопирует руками.
    copied.value = false
  }
}

onBeforeUnmount(() => {
  if (resetTimer) clearTimeout(resetTimer)
})
</script>

<template>
  <div class="text-center">
    <!-- Декоративная шестерёнка над заголовком -->
    <div class="mb-5 flex justify-center">
      <IconGear :size="72" color="brand" :hole-radius="30" :spin="20" />
    </div>

    <h3 class="text-3xl sm:text-4xl font-black text-ink leading-tight mb-4">
      Готово! Бесплатное занятие ваше
    </h3>
    <p class="text-base sm:text-lg text-slate max-w-xl mx-auto">
      Покажите промокод преподавателю при первом посещении —
      и пробное занятие в SBORIKA будет бесплатным.
    </p>

    <!-- Промокод — крупно, моноширинно, с кнопкой копирования -->
    <div class="mt-8 inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
      <div
        class="rounded-xl border-2 border-dashed border-brand bg-brand/5 px-6 py-4 sm:px-8"
      >
        <span class="text-2xl sm:text-3xl font-black text-brand tracking-widest font-mono">
          {{ code }}
        </span>
      </div>
      <BrandButton
        variant="primary"
        size="md"
        @click="copyCode(code)"
      >
        <svg
          v-if="!copied"
          xmlns="http://www.w3.org/2000/svg"
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          aria-hidden="true"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        {{ copied ? "Скопировано" : "Скопировать" }}
      </BrandButton>
    </div>

    <p class="mt-3 text-xs text-slate">Промокод действует 14 дней</p>

    <!-- Действия: записаться + пройти квиз заново -->
    <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
      <BrandButton href="#contacts" variant="primary" size="lg" @click="applyPromoToForm">
        Записаться на занятие
      </BrandButton>
      <BrandButton variant="ghost" size="lg" @click="emit('reset')">
        Пройти квиз заново
      </BrandButton>
    </div>
  </div>
</template>
