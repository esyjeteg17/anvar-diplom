<script setup lang="ts">
/**
 * Навигация по неделям: показывает текущий период (Пн—Вс),
 * кнопки «◀», «▶», «Сегодня». Состояние недели управляется снаружи
 * через v-model:start (Date понедельника недели).
 */

import { addDays, formatHumanDate, startOfWeek } from "~/composables/useDate"

const props = defineProps<{
  /** Понедельник текущей недели */
  modelValue: Date
}>()

const emit = defineEmits<{
  (e: "update:modelValue", v: Date): void
}>()

/** Текстовое представление периода: «12 мая 2026 — 18 мая 2026». */
const label = computed<string>(() => {
  const monday = props.modelValue
  const sunday = addDays(monday, 6)
  return `${formatHumanDate(monday)} — ${formatHumanDate(sunday)}`
})

function shift(weeks: number) {
  emit("update:modelValue", addDays(props.modelValue, weeks * 7))
}

function jumpToday() {
  emit("update:modelValue", startOfWeek(new Date()))
}
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-line bg-white text-ink hover:border-brand transition-colors"
        aria-label="Предыдущая неделя"
        @click="shift(-1)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        type="button"
        class="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-line bg-white text-ink hover:border-brand transition-colors"
        aria-label="Следующая неделя"
        @click="shift(1)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
      <button
        type="button"
        class="rounded-xl border-2 border-line bg-white px-4 h-10 text-sm font-semibold text-ink hover:border-brand transition-colors"
        @click="jumpToday"
      >
        Сегодня
      </button>
    </div>

    <div class="text-base sm:text-lg font-bold text-ink">
      {{ label }}
    </div>
  </div>
</template>
