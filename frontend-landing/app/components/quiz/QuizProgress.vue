<script setup lang="ts">
/**
 * Прогресс квиза: текстовый индикатор «Вопрос X из Y» + полоска заполнения.
 * Принимает текущий шаг и общее количество вопросов через пропсы,
 * чтобы быть полностью независимым от стора (легко переиспользовать).
 */

const props = defineProps<{
  /** Индекс текущего шага, начиная с 0 */
  step: number
  /** Общее число шагов */
  total: number
}>()

/** 0..100 — процент закрашенной части полоски. */
const percent = computed<number>(() =>
  Math.round((props.step / props.total) * 100),
)
</script>

<template>
  <div>
    <div class="flex items-center justify-between text-xs sm:text-sm font-semibold mb-2">
      <span class="text-slate">Вопрос {{ Math.min(step + 1, total) }} из {{ total }}</span>
      <span class="text-brand">{{ percent }}%</span>
    </div>
    <!-- Полоска: серый фон + оранжевый заполнитель с плавной анимацией ширины -->
    <div class="h-2 rounded-full bg-line/60 overflow-hidden">
      <div
        class="h-full bg-brand transition-all duration-300 ease-out"
        :style="{ width: `${percent}%` }"
      />
    </div>
  </div>
</template>
