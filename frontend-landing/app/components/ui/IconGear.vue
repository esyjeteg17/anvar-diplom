<script setup lang="ts">
/**
 * Шестерёнка — главный декоративный элемент бренда SBORIKA.
 *
 * Форма генерируется программно из числа зубцов и радиусов, поэтому
 * один компонент покрывает все варианты, которые встречаются в макетах:
 * крупные/мелкие, оранжевые/сине-серые/белые, с центральным отверстием
 * или сплошные. Цвет настраивается через `currentColor`, поэтому работают
 * стандартные Tailwind-классы (`text-brand`, `text-slate`, `text-white` и т.д.).
 */

type GearColor = "brand" | "slate" | "ink" | "white" | "line"

const props = withDefaults(
  defineProps<{
    /** Размер в пикселях (квадрат) */
    size?: number | string
    /** Количество зубцов */
    teeth?: number
    /** Цвет: один из брендовых токенов */
    color?: GearColor
    /** Радиус центрального отверстия (0..40) — 0 значит без отверстия */
    holeRadius?: number
    /** Цвет центрального отверстия (для гармонии на нестандартном фоне).
     *  По умолчанию — фон страницы (имитация выреза). Можно задать брендовый
     *  токен (например, "brand"), чтобы шестерёнка не «прорывала» фон. */
    holeColor?: GearColor | "bg"
    /** Скорость вращения в секундах (0 = не вращать) */
    spin?: number
  }>(),
  {
    size: 96,
    teeth: 12,
    color: "brand",
    holeRadius: 28,
    holeColor: "bg",
    spin: 0,
  },
)

// Сопоставление пропа с Tailwind-классом цвета. Цвет идёт через currentColor → fill.
const colorClass: Record<GearColor, string> = {
  brand: "text-brand",
  slate: "text-slate",
  ink: "text-ink",
  white: "text-white",
  line: "text-line",
}

/**
 * Генерация контурного SVG-path шестерёнки.
 * Форма — окружность радиуса R с N прямоугольными зубцами по периметру.
 * Каждый зуб занимает половину угловой ширины, оставшееся — впадина.
 */
const gearPath = computed<string>(() => {
  const N = Math.max(4, props.teeth)
  const Ro = 50 // внешний радиус (вершина зуба)
  const Ri = 38 // радиус впадины — разница 12 даёт зубцы умеренной длины
  const slice = (2 * Math.PI) / N // угловая ширина одного зуба+впадины
  // Зубец трапециевидный: основание (на Ri) шире, чем вершина (на Ro).
  //   topHalf  — половина ширины зуба у вершины (узкая верхушка),
  //   baseHalf — половина ширины зуба у основания (широкое основание).
  // baseHalf > topHalf даёт характерные «скошенные» стенки зуба.
  const topHalf = slice / 6   // вершина зуба ~ 1/3 шага
  const baseHalf = slice / 5  // основание зуба ~ 2/5 шага

  const pts: Array<[number, number]> = []
  for (let i = 0; i < N; i++) {
    const center = i * slice - Math.PI / 2 // центр зуба, начало с верха
    // 4 точки на зуб: левая вершина, правая вершина, правое основание, левое основание следующего зуба
    pts.push([
      Math.cos(center - topHalf) * Ro,
      Math.sin(center - topHalf) * Ro,
    ])
    pts.push([
      Math.cos(center + topHalf) * Ro,
      Math.sin(center + topHalf) * Ro,
    ])
    pts.push([
      Math.cos(center + baseHalf) * Ri,
      Math.sin(center + baseHalf) * Ri,
    ])
    pts.push([
      Math.cos(center + slice - baseHalf) * Ri,
      Math.sin(center + slice - baseHalf) * Ri,
    ])
  }

  const head = `M ${pts[0]![0].toFixed(3)} ${pts[0]![1].toFixed(3)}`
  const rest = pts
    .slice(1)
    .map(([x, y]) => `L ${x.toFixed(3)} ${y.toFixed(3)}`)
    .join(" ")
  return `${head} ${rest} Z`
})

const sizePx = computed(() =>
  typeof props.size === "number" ? `${props.size}px` : props.size,
)

const spinStyle = computed(() =>
  props.spin > 0 ? { animation: `gear-spin ${props.spin}s linear infinite` } : {},
)
</script>

<template>
  <svg
    :width="sizePx"
    :height="sizePx"
    viewBox="-54 -54 108 108"
    xmlns="http://www.w3.org/2000/svg"
    :class="[colorClass[color], 'inline-block align-middle']"
    :style="spinStyle"
    aria-hidden="true"
  >
    <!-- Тело шестерёнки. Stroke того же цвета + stroke-linejoin="round"
         даёт визуальное скругление всех углов между зубцами и впадинами. -->
    <path
      :d="gearPath"
      fill="currentColor"
      stroke="currentColor"
      stroke-width="10"
      stroke-linejoin="round"
      stroke-linecap="round"
    />
    <!-- Центральное отверстие. По умолчанию — цвет фона (имитация выреза);
         если шестерёнка стоит на нестандартном фоне, через проп holeColor
         можно покрасить центр в брендовый токен. -->
    <circle
      v-if="holeRadius > 0"
      cx="0"
      cy="0"
      :r="holeRadius"
      :fill="`var(--color-${holeColor})`"
    />
  </svg>
</template>

<style>
@keyframes gear-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
</style>
