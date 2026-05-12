<script setup lang="ts">
/**
 * Логотип SBORIKA — крупная брендовая надпись.
 * Буква «O» заменена на шестерёнку (компонент IconGear).
 * Параметр `size` управляет общим размером, остальные элементы масштабируются.
 * Параметр `tagline` показывает подпись «школа инженерного мышления для детей».
 */

const props = withDefaults(
  defineProps<{
    /** Размер шрифта основного слова в rem-ах */
    size?: "sm" | "md" | "lg" | "xl"
    /** Показывать подпись под логотипом */
    tagline?: boolean
    /** Тема: на светлом фоне (тёмный текст) или на тёмном (белый) */
    theme?: "light" | "dark"
  }>(),
  {
    size: "md",
    tagline: false,
    theme: "light",
  },
)

// Маппинг размера на классы Tailwind для всех частей логотипа
const sizeMap = {
  sm: { word: "text-xl",  gear: 22, tag: "text-[10px]"  },
  md: { word: "text-3xl", gear: 32, tag: "text-xs"      },
  lg: { word: "text-5xl", gear: 52, tag: "text-sm"      },
  xl: { word: "text-7xl", gear: 76, tag: "text-base"    },
} as const

const cfg = computed(() => sizeMap[props.size])

const wordColor = computed(() =>
  props.theme === "dark" ? "text-white" : "text-brand",
)
</script>

<template>
  <div class="inline-flex flex-col items-center leading-none select-none">
    <div class="flex items-center font-black tracking-tight" :class="[cfg.word, wordColor]">
      <span>SB</span>
      <!-- Буква O заменена шестерёнкой бренда -->
      <IconGear
        :size="cfg.gear"
        color="brand"
        :teeth="12"
        :hole-radius="30"
        class="mx-[0.04em]"
      />
      <span>RIKA</span>
    </div>
    <p
      v-if="tagline"
      class="mt-1 font-medium tracking-wide"
      :class="[cfg.tag, theme === 'dark' ? 'text-line' : 'text-slate']"
    >
      школа инженерного мышления для детей
    </p>
  </div>
</template>
