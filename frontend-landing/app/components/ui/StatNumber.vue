<script setup lang="ts">
/**
 * Анимированная цифра — насчитывается от 0 до целевого значения,
 * когда блок попадает в viewport. Использует useReveal для запуска
 * анимации только тогда, когда пользователь действительно увидит цифру.
 */

type StatIcon = "map" | "users" | "calendar" | "graduation"

const props = withDefaults(
  defineProps<{
    /** Целевое значение */
    value: number
    /** Длительность анимации в миллисекундах */
    duration?: number
    /** Подпись к цифре */
    label: string
    /** Префикс перед цифрой (например, "≈") */
    prefix?: string
    /** Суффикс после цифры (например, "+", " лет") */
    suffix?: string
    /** Какую иконку показать в кружке над цифрой */
    icon?: StatIcon
  }>(),
  {
    duration: 1400,
    prefix: "",
    suffix: "",
  },
)

const { el, visible } = useReveal({ threshold: 0.4 })

const displayed = ref<number>(0)
let raf: number | null = null

/** easeOutCubic — быстрый старт, плавное завершение. */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

watch(visible, (v) => {
  if (!v) return
  const start = performance.now()
  const target = props.value
  const dur = props.duration

  const step = (now: number) => {
    const elapsed = now - start
    const t = Math.min(1, elapsed / dur)
    displayed.value = Math.round(target * easeOutCubic(t))
    if (t < 1) {
      raf = requestAnimationFrame(step)
    }
  }
  raf = requestAnimationFrame(step)
})

onBeforeUnmount(() => {
  if (raf !== null) cancelAnimationFrame(raf)
})
</script>

<template>
  <div ref="el" class="text-center">
    <!-- Иконка-плашка над цифрой (если задана) — даёт стат-карточке смысл с первого взгляда -->
    <div
      v-if="icon"
      class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand"
    >
      <svg
        v-if="icon === 'map'"
        xmlns="http://www.w3.org/2000/svg"
        width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      <svg
        v-else-if="icon === 'users'"
        xmlns="http://www.w3.org/2000/svg"
        width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
      <svg
        v-else-if="icon === 'calendar'"
        xmlns="http://www.w3.org/2000/svg"
        width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
      <svg
        v-else-if="icon === 'graduation'"
        xmlns="http://www.w3.org/2000/svg"
        width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    </div>

    <div class="text-5xl sm:text-6xl md:text-7xl font-black text-brand leading-none tabular-nums">
      <span>{{ prefix }}{{ displayed }}{{ suffix }}</span>
    </div>
    <div class="mt-3 text-sm sm:text-base font-medium text-slate uppercase tracking-wider">
      {{ label }}
    </div>
  </div>
</template>
