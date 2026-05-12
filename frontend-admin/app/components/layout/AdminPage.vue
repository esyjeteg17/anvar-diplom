<script setup lang="ts">
/**
 * Обёртка страницы админки: заголовок + (опционально) описание + слот контента.
 * Используется на всех трёх вкладках, чтобы шапка страницы выглядела одинаково.
 */

defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
    <header class="mb-6 sm:mb-8 flex items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-ink leading-tight">
          {{ title }}
        </h1>
        <p v-if="description" class="mt-1.5 text-sm sm:text-base text-slate">
          {{ description }}
        </p>
      </div>
      <!-- Слот для кнопок-действий справа от заголовка (например, "Добавить") -->
      <div class="shrink-0">
        <slot name="actions" />
      </div>
    </header>

    <slot />
  </div>
</template>
