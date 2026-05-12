<script setup lang="ts">
/**
 * Каркас одной секции лендинга. Принимает `id` (для якорной навигации),
 * фон и вертикальные отступы. Внутри уже стоит SiteContainer, поэтому
 * секция-наследник кладёт сразу контент.
 */

withDefaults(
  defineProps<{
    /** id секции — для ссылок-якорей */
    id?: string
    /** Цвет фона: страница (bg) / тёмный (ink) / приглушённый сине-серый (slate) */
    background?: "bg" | "ink" | "slate" | "white"
    /** Вертикальные отступы */
    padding?: "sm" | "md" | "lg"
    /** Размер контейнера внутри */
    container?: "narrow" | "default" | "wide"
  }>(),
  {
    background: "bg",
    padding: "lg",
    container: "default",
  },
)

const bgClass = {
  bg: "bg-bg",
  ink: "bg-ink text-white",
  slate: "bg-slate text-white",
  white: "bg-white",
} as const

const padClass = {
  sm: "py-10",
  md: "py-16",
  lg: "py-24",
} as const
</script>

<template>
  <section
    :id="id"
    :class="[
      bgClass[background ?? 'bg'],
      padClass[padding ?? 'lg'],
      // isolate создаёт CSS stacking context: любые внутренние z-index
      // (например, panes Leaflet с z-index 200-700) останутся внутри секции
      // и не перекроют sticky-шапку.
      'relative overflow-hidden isolate',
    ]"
  >
    <SiteContainer :size="container">
      <slot />
    </SiteContainer>
  </section>
</template>
