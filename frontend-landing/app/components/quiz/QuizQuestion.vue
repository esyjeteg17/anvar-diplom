<script setup lang="ts">
/**
 * Экран одного вопроса квиза: заголовок + список вариантов.
 * Сам по себе stateless — получает данные вопроса и текущий выбор через пропсы,
 * выбор пробрасывает наверх через событие `select`.
 */

import type { QuizQuestion } from "~/stores/quiz"

defineProps<{
  /** Объект вопроса со списком вариантов */
  question: QuizQuestion
  /** ID выбранного варианта (или null) */
  selectedOptionId: string | null
}>()

const emit = defineEmits<{
  (e: "select", optionId: string): void
}>()
</script>

<template>
  <div>
    <h3 class="text-2xl sm:text-3xl font-bold text-ink leading-tight mb-6 sm:mb-8">
      {{ question.text }}
    </h3>
    <div class="space-y-3 sm:space-y-3.5">
      <QuizOption
        v-for="opt in question.options"
        :key="opt.id"
        :label="opt.label"
        :selected="selectedOptionId === opt.id"
        @select="emit('select', opt.id)"
      />
    </div>
  </div>
</template>
