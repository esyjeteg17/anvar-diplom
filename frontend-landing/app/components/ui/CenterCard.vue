<script setup lang="ts">
/**
 * Карточка партнёрского центра. Показывает название, адрес, метро.
 * Если у центра есть свой акцентный цвет (например, у разных районов Москвы),
 * можно поменять цвет полоски сверху через `accent`.
 */

type Accent = "brand" | "slate" | "ink"

withDefaults(
  defineProps<{
    /** Название центра */
    name: string
    /** Полный адрес */
    address: string
    /** Ближайшее метро (опционально) */
    metro?: string
    /** Цвет верхней акцентной полоски */
    accent?: Accent
  }>(),
  { accent: "brand" },
)

const accentClasses: Record<Accent, string> = {
  brand: "bg-brand",
  slate: "bg-slate",
  ink: "bg-ink",
}
</script>

<template>
  <article
    class="group relative overflow-hidden rounded-2xl bg-white border border-line/60 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_14px_36px_-10px_rgba(234,92,31,0.28)] hover:border-brand/40"
  >
    <!-- Акцентная полоска сверху — добавляет «брендовости» и помогает отличать центры -->
    <div :class="['h-1.5 w-full', accentClasses[accent ?? 'brand']]" />

    <div class="p-6 md:p-7">
      <h3 class="text-lg sm:text-xl font-bold text-ink mb-3">
        {{ name }}
      </h3>

      <!-- Адрес с иконкой-«пином» -->
      <p class="flex items-start gap-2 text-sm sm:text-base text-slate leading-relaxed">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="shrink-0 mt-0.5 text-brand"
          aria-hidden="true"
        >
          <path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span>{{ address }}</span>
      </p>

      <!-- Метро (если задано) — в стиле московского указателя -->
      <p
        v-if="metro"
        class="mt-3 flex items-center gap-2 text-sm sm:text-base text-ink/80"
      >
        <span
          class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white text-[11px] font-black"
          aria-hidden="true"
        >
          М
        </span>
        <span>{{ metro }}</span>
      </p>
    </div>
  </article>
</template>
