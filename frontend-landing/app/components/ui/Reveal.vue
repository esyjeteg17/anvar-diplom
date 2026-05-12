<script setup lang="ts">
/**
 * Обёртка-аниматор: содержимое плавно появляется при попадании в viewport.
 * Под капотом — composable useReveal с IntersectionObserver.
 *
 * Пропсы позволяют менять направление, задержку и длительность,
 * что полезно для stagger-эффектов: при `:delay="i * 100"` карточки
 * в сетке появляются по очереди.
 */

type Direction = "up" | "down" | "left" | "right" | "fade"

const props = withDefaults(
  defineProps<{
    /** Направление появления (для эффекта slide вместе с fade) */
    direction?: Direction
    /** Задержка в миллисекундах */
    delay?: number
    /** Длительность анимации в миллисекундах */
    duration?: number
    /** На сколько пикселей сдвигается элемент в исходном состоянии */
    distance?: number
  }>(),
  {
    direction: "up",
    delay: 0,
    duration: 700,
    distance: 28,
  },
)

const { el, visible } = useReveal()

// Исходный transform: смещение в зависимости от direction.
// Пока visible=false — элемент сдвинут и прозрачен; при visible=true — на месте.
const initialTransform = computed<string>(() => {
  switch (props.direction) {
    case "up":    return `translate3d(0, ${props.distance}px, 0)`
    case "down":  return `translate3d(0, -${props.distance}px, 0)`
    case "left":  return `translate3d(${props.distance}px, 0, 0)`
    case "right": return `translate3d(-${props.distance}px, 0, 0)`
    case "fade":  return "none"
  }
  return "none"
})
</script>

<template>
  <div
    ref="el"
    class="will-change-transform"
    :style="{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : initialTransform,
      transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
    }"
  >
    <slot />
  </div>
</template>
