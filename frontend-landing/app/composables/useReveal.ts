/**
 * useReveal — composable для scroll-анимаций.
 *
 * Привязывает IntersectionObserver к ref-элементу и переключает реактивный
 * флаг `visible` в true один раз — когда элемент появляется в viewport
 * (по умолчанию хотя бы на 15% высоты).
 *
 * Используется компонентом <Reveal> и любым другим, кому нужно "оживить"
 * блок при появлении на экране.
 */
export function useReveal(options?: {
  /** Доля элемента, которая должна попасть в viewport (0..1) */
  threshold?: number
  /** Корневой margin для observer (например, "0px 0px -10% 0px") */
  rootMargin?: string
}) {
  const el = ref<HTMLElement | null>(null)
  const visible = ref<boolean>(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    // На сервере window нет, и в SSR observer не создаём.
    if (typeof window === "undefined" || !el.value) return

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.value = true
            // Анимация — одноразовая. После показа отключаем observer,
            // чтобы не тратить ресурсы на дальнейший скролл.
            observer?.disconnect()
            break
          }
        }
      },
      {
        threshold: options?.threshold ?? 0.15,
        rootMargin: options?.rootMargin ?? "0px 0px -5% 0px",
      },
    )
    observer.observe(el.value)
  })

  onBeforeUnmount(() => observer?.disconnect())

  return { el, visible }
}
