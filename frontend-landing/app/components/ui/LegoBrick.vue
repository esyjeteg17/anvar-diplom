<script setup lang="ts">
/**
 * Декоративный LEGO-кубик в изометрической проекции — поддерживающий
 * визуальный мотив SBORIKA (на постере встречался рядом с шестерёнками).
 *
 * Геометрия рисуется тремя ромбами: верхняя грань (2 «стука»), правая
 * боковая, левая боковая — каждая своего оттенка одного цвета бренда.
 * Размер задаётся пропом `size` (ширина кубика в пикселях).
 */

type BrickColor = "brand" | "slate" | "ink" | "white"

const props = withDefaults(
  defineProps<{
    /** Ширина кубика в пикселях */
    size?: number
    /** Цвет */
    color?: BrickColor
    /** Скорость лёгкого «парения» по вертикали (сек). 0 — без анимации. */
    float?: number
  }>(),
  { size: 80, color: "slate", float: 0 },
)

/** Палитра трёх оттенков на каждый цвет: верх / правая грань / левая грань. */
const palettes: Record<BrickColor, { top: string; right: string; left: string; stud: string }> = {
  brand: { top: "#ea5c1f", right: "#bb4612", left: "#d24f15", stud: "#f57e44" },
  slate: { top: "#4f5d75", right: "#374152", left: "#3d4a5e", stud: "#6c7a93" },
  ink:   { top: "#212431", right: "#0f111a", left: "#161924", stud: "#3a3f50" },
  white: { top: "#ffffff", right: "#cfd1d3", left: "#e6e7e8", stud: "#ffffff" },
}

const c = computed(() => palettes[props.color])

const floatStyle = computed(() =>
  props.float > 0 ? { animation: `lego-float ${props.float}s ease-in-out infinite` } : {},
)
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    :style="floatStyle"
    aria-hidden="true"
    class="inline-block align-middle"
  >
    <!-- Левая боковая грань -->
    <polygon
      points="10,40 50,60 50,90 10,70"
      :fill="c.left"
    />
    <!-- Правая боковая грань -->
    <polygon
      points="90,40 50,60 50,90 90,70"
      :fill="c.right"
    />
    <!-- Верхняя грань -->
    <polygon
      points="50,20 90,40 50,60 10,40"
      :fill="c.top"
    />
    <!-- Два «штифта» сверху (LEGO studs) -->
    <ellipse cx="35" cy="34" rx="9" ry="4.5" :fill="c.stud" />
    <ellipse cx="65" cy="34" rx="9" ry="4.5" :fill="c.stud" />
    <ellipse
      cx="35" cy="32" rx="9" ry="4.5"
      :fill="c.top"
      :stroke="c.right"
      stroke-width="0.5"
    />
    <ellipse
      cx="65" cy="32" rx="9" ry="4.5"
      :fill="c.top"
      :stroke="c.right"
      stroke-width="0.5"
    />
  </svg>
</template>

<style>
@keyframes lego-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-8px); }
}
</style>
