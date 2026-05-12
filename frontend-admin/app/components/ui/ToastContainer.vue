<script setup lang="ts">
/**
 * Контейнер toast-уведомлений. Рендерится один раз в layout-е и подписан
 * на стор toasts. Всё, что попадает в стор, появляется в правом нижнем углу
 * экрана с плавной анимацией и автоматически исчезает через несколько секунд.
 */

import { useToastsStore } from "~/stores/toasts"

const toasts = useToastsStore()

/** Цветовая схема + иконка по тону тоста — одно место правды. */
const toneStyles = {
  success: {
    wrap: "bg-white border-brand/40",
    icon: "text-brand",
    accent: "bg-brand",
  },
  error: {
    wrap: "bg-white border-brand/60",
    icon: "text-brand",
    accent: "bg-brand",
  },
  info: {
    wrap: "bg-white border-line",
    icon: "text-slate",
    accent: "bg-slate",
  },
} as const
</script>

<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed bottom-4 right-4 z-[3000] flex flex-col gap-2 max-w-sm w-[calc(100%-2rem)]"
      aria-live="polite"
      aria-atomic="true"
    >
      <TransitionGroup
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-2 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition duration-150 ease-in absolute"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0 translate-x-4"
      >
        <div
          v-for="toast in toasts.items"
          :key="toast.id"
          :class="[
            'pointer-events-auto relative overflow-hidden rounded-xl border shadow-md flex items-center gap-3 pl-4 pr-3 py-3',
            toneStyles[toast.tone].wrap,
          ]"
          role="status"
        >
          <!-- Цветная вертикальная полоска слева — быстрый визуальный маркер тона -->
          <span :class="['absolute left-0 top-0 bottom-0 w-1', toneStyles[toast.tone].accent]" />

          <!-- Иконка типа сообщения -->
          <span :class="['shrink-0', toneStyles[toast.tone].icon]">
            <svg
              v-if="toast.tone === 'success'"
              xmlns="http://www.w3.org/2000/svg"
              width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <svg
              v-else-if="toast.tone === 'error'"
              xmlns="http://www.w3.org/2000/svg"
              width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </span>

          <p class="flex-1 text-sm font-medium text-ink leading-snug">
            {{ toast.text }}
          </p>

          <button
            type="button"
            class="shrink-0 flex h-7 w-7 items-center justify-center rounded-md text-slate hover:bg-line/60"
            aria-label="Закрыть"
            @click="toasts.remove(toast.id)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
