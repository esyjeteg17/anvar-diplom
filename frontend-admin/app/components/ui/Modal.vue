<script setup lang="ts">
/**
 * Модальное окно админки. Используется для форм создания/редактирования.
 * Закрывается по клику на оверлей, по клавише Esc и через кнопку «×».
 *
 * Открыто/закрыто управляется снаружи через `v-model` (boolean).
 */

const props = withDefaults(
  defineProps<{
    /** Открыто ли окно */
    modelValue: boolean
    /** Заголовок в шапке окна */
    title?: string
    /** Размер контейнера */
    size?: "sm" | "md" | "lg"
  }>(),
  { size: "md" },
)

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
  (e: "close"): void
}>()

function close() {
  emit("update:modelValue", false)
  emit("close")
}

// Закрытие по Esc — глобальный listener, который добавляется только пока
// окно открыто. Иначе все модалки начнут реагировать друг на друга.
function onKey(e: KeyboardEvent) {
  if (e.key === "Escape" && props.modelValue) close()
}

watch(
  () => props.modelValue,
  (open) => {
    if (typeof window === "undefined") return
    if (open) {
      window.addEventListener("keydown", onKey)
      // Блокируем прокрутку страницы под модалкой.
      document.body.style.overflow = "hidden"
    } else {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  },
)

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("keydown", onKey)
    document.body.style.overflow = ""
  }
})

const sizeClass = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
} as const
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[2000] flex items-start justify-center overflow-y-auto bg-ink/40 backdrop-blur-sm py-10 px-4"
        @click.self="close"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-4 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 translate-y-4 scale-95"
          appear
        >
          <div
            v-if="modelValue"
            :class="[
              'w-full rounded-2xl bg-white shadow-xl border border-line/60',
              sizeClass[size ?? 'md'],
            ]"
            role="dialog"
            aria-modal="true"
            @click.stop
          >
            <header
              v-if="title || $slots.title"
              class="flex items-center justify-between px-6 py-4 border-b border-line/60"
            >
              <h3 class="text-lg font-bold text-ink">
                <slot name="title">{{ title }}</slot>
              </h3>
              <button
                type="button"
                aria-label="Закрыть"
                class="flex h-9 w-9 items-center justify-center rounded-lg text-ink hover:bg-line/60"
                @click="close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </header>

            <div class="px-6 py-5">
              <slot />
            </div>

            <footer
              v-if="$slots.footer"
              class="flex items-center justify-end gap-3 px-6 py-4 border-t border-line/60 bg-line/20 rounded-b-2xl"
            >
              <slot name="footer" />
            </footer>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
