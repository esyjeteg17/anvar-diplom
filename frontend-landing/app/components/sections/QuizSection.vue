<script setup lang="ts">
/**
 * Секция «Квиз». Управляет потоком прохождения через Pinia-стор useQuizStore.
 * Сама секция — только композиция: подзаголовок секции, прогресс,
 * текущий вопрос (или результат) и кнопки навигации.
 *
 * Логика «какой вопрос показывать» / «можно ли идти дальше» / «промокод» —
 * полностью в сторе, никаких бизнес-правил в шаблоне быть не должно.
 */

import { storeToRefs } from "pinia"
import { useQuizStore } from "~/stores/quiz"

const quiz = useQuizStore()
const {
  questions,
  currentStep,
  answers,
  finished,
  currentQuestion,
  canGoNext,
  canGoPrev,
  isLastStep,
  promoCode,
} = storeToRefs(quiz)

/** Сохранение выбранного варианта в стор. */
function onSelect(optionId: string) {
  if (currentQuestion.value) {
    quiz.answer(currentQuestion.value.id, optionId)
  }
}
</script>

<template>
  <SectionWrapper id="quiz" background="bg" padding="lg">
    <BackgroundGears variant="flow" />

    <Reveal direction="up">
      <SectionHeading
        eyebrow="Бесплатное занятие"
        title="Пройдите квиз и получите промокод"
        description="10 коротких вопросов — и вы получите промокод на бесплатное пробное занятие в SBORIKA."
      />
    </Reveal>

    <!-- Карточка квиза. Внутри либо текущий вопрос с навигацией, либо экран результата. -->
    <Reveal direction="up" :delay="100">
    <div
      class="mx-auto max-w-2xl rounded-2xl bg-white border border-line/60 shadow-sm p-6 sm:p-8 md:p-10"
    >
      <!-- Прохождение -->
      <template v-if="!finished">
        <QuizProgress
          :step="currentStep"
          :total="questions.length"
          class="mb-8"
        />

        <!-- Анимация смены вопроса -->
        <Transition
          mode="out-in"
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <QuizQuestion
            v-if="currentQuestion"
            :key="currentQuestion.id"
            :question="currentQuestion"
            :selected-option-id="answers[currentQuestion.id] ?? null"
            @select="onSelect"
          />
        </Transition>

        <!-- Кнопки навигации -->
        <div class="mt-8 flex items-center justify-between gap-3">
          <BrandButton
            variant="ghost"
            size="md"
            :disabled="!canGoPrev"
            @click="quiz.prev()"
          >
            Назад
          </BrandButton>
          <BrandButton
            variant="primary"
            size="md"
            :disabled="!canGoNext"
            @click="quiz.next()"
          >
            {{ isLastStep ? "Получить промокод" : "Дальше" }}
          </BrandButton>
        </div>
      </template>

      <!-- Результат -->
      <QuizResult
        v-else
        :code="promoCode"
        @reset="quiz.reset()"
      />
    </div>
    </Reveal>
  </SectionWrapper>
</template>
