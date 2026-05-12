<script setup lang="ts">
/**
 * Карточка с одной финансовой цифрой — большая сумма + подпись + опциональный
 * мини-комментарий снизу. Один компонент на все 4 показателя дашборда:
 * различия только в цвете акцента и надписях, передаются через пропсы.
 */

withDefaults(
  defineProps<{
    /** Подпись над цифрой ("ДОХОД", "ПРИБЫЛЬ" и т.д.) */
    label: string
    /** Сумма в рублях */
    value: number
    /** Текст под цифрой (напр. "за май 2026" или "5 активных детей") */
    hint?: string
    /** Цветовая схема акцента — отражает смысл цифры. */
    tone?: "neutral" | "income" | "expense" | "profit"
    /** Показать ли цифру с минусом, когда отрицательна (для прибыли). */
    signed?: boolean
  }>(),
  {
    tone: "neutral",
    signed: false,
  },
)

/** Маппинг tone → классы Tailwind. Один источник стилизации цвета. */
const toneClass = {
  neutral: { stripe: "bg-slate", value: "text-ink" },
  income:  { stripe: "bg-brand", value: "text-brand" },
  expense: { stripe: "bg-slate", value: "text-slate" },
  profit:  { stripe: "bg-ink",   value: "text-ink" },
} as const

function format(value: number, signed: boolean): string {
  const abs = Math.abs(value).toLocaleString("ru-RU", { maximumFractionDigits: 0 })
  const sign = signed && value < 0 ? "−" : signed && value > 0 ? "+" : ""
  return `${sign}${abs} ₽`
}
</script>

<template>
  <article class="relative overflow-hidden rounded-2xl bg-white border border-line/60 shadow-sm">
    <!-- Цветная акцентная полоска слева — отличает тип цифры -->
    <div :class="['absolute left-0 top-0 bottom-0 w-1.5', toneClass[tone].stripe]" />

    <div class="p-5 sm:p-6">
      <div class="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate mb-1.5">
        {{ label }}
      </div>
      <div :class="['text-2xl sm:text-3xl font-black leading-none tabular-nums', toneClass[tone].value]">
        {{ format(value, signed) }}
      </div>
      <p v-if="hint" class="mt-2 text-xs text-slate/90">
        {{ hint }}
      </p>
    </div>
  </article>
</template>
