<script setup lang="ts">
/**
 * Карточка с иконкой-шестерёнкой и текстом.
 * Используется в секциях «О школе», «Занятия», «Центры» и других местах,
 * где нужно показать набор тезисов в виде сетки. Цвет иконки/фона/выравнивания
 * управляются пропсами — вместо плодить разные карточки.
 */

type Variant = "light" | "outline" | "dark"
type GearColor = "brand" | "slate" | "ink" | "white" | "line"

withDefaults(
  defineProps<{
    /** Заголовок карточки */
    title: string
    /** Описание/текст внутри */
    description: string
    /** Цвет иконки-шестерёнки (по умолчанию — оранжевый бренд) */
    iconColor?: GearColor
    /** Стиль карточки: фон+тень / только обводка / тёмный */
    variant?: Variant
    /** Выравнивание содержимого */
    align?: "left" | "center"
  }>(),
  {
    iconColor: "brand",
    variant: "light",
    align: "left",
  },
)

const variantClasses: Record<Variant, string> = {
  light: "bg-white border border-line/60 shadow-sm",
  outline: "border-2 border-line/60",
  dark: "bg-ink text-white border border-ink",
}
</script>

<template>
  <article
    :class="[
      'group/card rounded-2xl p-6 md:p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_-8px_rgba(234,92,31,0.25)] hover:border-brand/40 cursor-default',
      variantClasses[variant ?? 'light'],
      align === 'center' ? 'text-center' : 'text-left',
    ]"
  >
    <!-- Иконка-шестерёнка как декоративный маркер карточки -->
    <div :class="['mb-4', align === 'center' ? 'flex justify-center' : '']">
      <!-- Размер отверстия как в логотипе SBORIKA — обод тонкий, шестерёнка лёгкая -->
      <IconGear :size="44" :color="iconColor" :hole-radius="30" />
    </div>
    <h3
      :class="[
        'text-lg sm:text-xl font-bold mb-2',
        variant === 'dark' ? 'text-white' : 'text-ink',
      ]"
    >
      {{ title }}
    </h3>
    <p
      :class="[
        'text-sm sm:text-base leading-relaxed',
        variant === 'dark' ? 'text-line' : 'text-slate',
      ]"
    >
      {{ description }}
    </p>
  </article>
</template>
