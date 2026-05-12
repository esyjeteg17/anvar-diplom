<script setup lang="ts">
/**
 * Универсальная кнопка/ссылка SBORIKA.
 * Работает и как `<button>`, и как `<NuxtLink>` (если задан `to`),
 * и как обычный якорь (если задан `href`). Варианты и размеры — через пропсы,
 * чтобы не плодить дубли.
 */

type Variant = "primary" | "outline" | "ghost"
type Size = "sm" | "md" | "lg"

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    /** Внутренний роут (NuxtLink) */
    to?: string
    /** Внешняя/якорная ссылка (<a>) */
    href?: string
    /** type для <button> */
    type?: "button" | "submit" | "reset"
    /** Растянуть на всю ширину родителя */
    block?: boolean
    /** Заблокировать */
    disabled?: boolean
  }>(),
  {
    variant: "primary",
    size: "md",
    type: "button",
    block: false,
    disabled: false,
  },
)

// Базовые классы общие для всех вариантов
const baseClasses =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand disabled:opacity-50 disabled:cursor-not-allowed"

// Классы по варианту
const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand text-white hover:bg-[#d24f15] active:bg-[#bb4612] shadow-sm",
  outline:
    "border-2 border-brand text-brand hover:bg-brand hover:text-white",
  ghost:
    "text-ink hover:bg-line/60",
}

// Классы по размеру
const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
}

const classes = computed(() => [
  baseClasses,
  variantClasses[props.variant],
  sizeClasses[props.size],
  props.block ? "w-full" : "",
])
</script>

<template>
  <NuxtLink v-if="to" :to="to" :class="classes">
    <slot />
  </NuxtLink>
  <a v-else-if="href" :href="href" :class="classes">
    <slot />
  </a>
  <button v-else :type="type" :disabled="disabled" :class="classes">
    <slot />
  </button>
</template>
