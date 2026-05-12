<script setup lang="ts">
/**
 * Внешняя обёртка с фиксированной максимальной шириной и горизонтальными отступами.
 * Используется на каждой секции, чтобы контент по горизонтали ложился одинаково.
 */
withDefaults(
  defineProps<{
    /** Размер: обычный, узкий (для текстовых блоков), широкий (для hero) */
    size?: "narrow" | "default" | "wide"
  }>(),
  { size: "default" },
)

const sizeClass = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
} as const
</script>

<template>
  <div :class="['mx-auto px-4 sm:px-6 lg:px-8', sizeClass[size ?? 'default']]">
    <slot />
  </div>
</template>
