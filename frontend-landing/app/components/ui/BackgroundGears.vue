<script setup lang="ts">
/**
 * Декоративный слой для любой секции — рендерит микс из вращающихся
 * шестерёнок и парящих LEGO-кубиков. Несмотря на старое имя файла
 * (исторически — только шестерёнки), теперь это общий «декор-фон»
 * с поддерживающим визуалом обоих мотивов SBORIKA.
 *
 * Готовые пресеты: 'corners' (по углам), 'flow' (диагональ через секцию),
 * 'subtle' (минимум), 'edge-left' / 'edge-right' (с одной стороны).
 *
 * Шестерёнки крутятся в разные стороны, кубики мягко парят — в сумме
 * фон становится «живым», но не отвлекает от контента.
 */

type GearColor = "brand" | "slate" | "ink" | "white" | "line"
type BrickColor = "brand" | "slate" | "ink" | "white"

interface BgGear {
  kind: "gear"
  size: number
  color: GearColor
  pos: string
  teeth?: number
  spin: number
  /** Опционально — обратное вращение (для разнообразия). */
  reverse?: boolean
}

interface BgBrick {
  kind: "brick"
  size: number
  color: BrickColor
  pos: string
  /** Скорость лёгкого «парения» вверх-вниз (сек) */
  float: number
}

type BgItem = BgGear | BgBrick

type Variant = "corners" | "flow" | "subtle" | "edge-left" | "edge-right"

const props = withDefaults(
  defineProps<{
    /** Готовый пресет расположения декора */
    variant?: Variant
  }>(),
  { variant: "corners" },
)

// Пресеты — каждый набор подобран так, чтобы декор не мешал контенту,
// но создавал ощущение «живого фона».
// ВАЖНО: все позиции берём с положительными отступами от краёв секции,
// иначе элементы обрезаются на стыке секций (overflow-hidden у SectionWrapper).
const presets: Record<Variant, BgItem[]> = {
  corners: [
    { kind: "gear",  size: 160, color: "brand", pos: "top-[6%] right-[5%] opacity-10",        spin: 36 },
    { kind: "brick", size: 80,  color: "slate", pos: "bottom-[14%] left-[6%] opacity-25",     float: 5.0 },
    { kind: "gear",  size: 70,  color: "line",  pos: "top-[22%] left-[10%] opacity-30",       spin: 22 },
  ],
  flow: [
    { kind: "gear",  size: 180, color: "brand", pos: "top-[6%] right-[3%] opacity-10",        spin: 42 },
    { kind: "brick", size: 70,  color: "brand", pos: "top-[40%] right-[18%] opacity-25",      float: 4.5 },
    { kind: "gear",  size: 90,  color: "line",  pos: "bottom-[18%] right-[35%] opacity-25",   spin: 24 },
    { kind: "brick", size: 90,  color: "slate", pos: "bottom-[10%] left-[10%] opacity-25",    float: 5.6 },
    { kind: "gear",  size: 60,  color: "slate", pos: "top-[16%] left-[22%] opacity-25",       spin: 18 },
  ],
  subtle: [
    { kind: "gear",  size: 140, color: "brand", pos: "top-[10%] right-[4%] opacity-10",       spin: 50 },
    { kind: "brick", size: 80,  color: "slate", pos: "bottom-[20%] left-[6%] opacity-25",     float: 5.4 },
  ],
  "edge-left": [
    { kind: "gear",  size: 170, color: "brand", pos: "top-[6%] left-[3%] opacity-10",         spin: 38 },
    { kind: "brick", size: 80,  color: "slate", pos: "bottom-[16%] left-[14%] opacity-25",    float: 5.2 },
    { kind: "gear",  size: 70,  color: "line",  pos: "top-[45%] left-[8%] opacity-25",        spin: 22 },
  ],
  "edge-right": [
    { kind: "gear",  size: 170, color: "brand", pos: "top-[6%] right-[3%] opacity-10",        spin: 38 },
    { kind: "brick", size: 80,  color: "slate", pos: "bottom-[16%] right-[14%] opacity-25",   float: 5.2 },
    { kind: "gear",  size: 70,  color: "line",  pos: "top-[45%] right-[8%] opacity-25",       spin: 22 },
  ],
}

const items = computed<BgItem[]>(() => presets[props.variant ?? "corners"])
</script>

<template>
  <!-- Слой строго ниже контента, не перехватывает клики. -->
  <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <template v-for="(item, i) in items" :key="i">
      <IconGear
        v-if="item.kind === 'gear'"
        :size="item.size"
        :color="item.color"
        :teeth="item.teeth ?? 12"
        :spin="item.spin"
        :class="['absolute', item.pos, item.reverse ? 'gear-reverse' : '']"
      />
      <LegoBrick
        v-else
        :size="item.size"
        :color="item.color"
        :float="item.float"
        :class="['absolute drop-shadow-md', item.pos]"
      />
    </template>
  </div>
</template>

<style>
/* Обратное направление вращения. Парный animation в IconGear называется gear-spin;
   здесь мы переопределяем direction на reverse для помеченных шестерёнок. */
.gear-reverse {
  animation-direction: reverse !important;
}
</style>
