<script setup lang="ts">
/**
 * Колонка одного дня недели в расписании. Шапка с днём недели и числом,
 * список карточек занятий + кнопка «+ Добавить».
 * Все события прокидываются в родителя.
 */

import type { Lesson } from "~/stores/lessons"
import { fullWeekday, sameDay, shortWeekday, todayLocal } from "~/composables/useDate"

const props = defineProps<{
  date: Date
  lessons: Lesson[]
}>()

const emit = defineEmits<{
  (e: "add-lesson", date: Date): void
  (e: "select-lesson", lesson: Lesson): void
}>()

const isToday = computed<boolean>(() => sameDay(props.date, todayLocal()))

const sortedLessons = computed<Lesson[]>(() =>
  [...props.lessons].sort((a, b) => a.start_time.localeCompare(b.start_time)),
)
</script>

<template>
  <div
    :class="[
      'flex flex-col rounded-2xl border bg-white min-h-[180px]',
      isToday ? 'border-brand shadow-sm' : 'border-line/60',
    ]"
  >
    <header
      :class="[
        'px-3 py-2.5 border-b flex items-center justify-between',
        isToday ? 'border-brand/40 bg-brand/5' : 'border-line/60',
      ]"
    >
      <div>
        <div class="text-xs font-semibold uppercase tracking-wider text-slate">
          {{ shortWeekday(date) }}
        </div>
        <div :class="['text-xl font-black leading-none mt-0.5', isToday ? 'text-brand' : 'text-ink']">
          {{ date.getDate() }}
        </div>
      </div>
      <button
        type="button"
        class="flex h-8 w-8 items-center justify-center rounded-lg text-slate hover:text-brand hover:bg-brand/10 transition-colors"
        :aria-label="`Добавить занятие на ${fullWeekday(date)}`"
        @click="emit('add-lesson', date)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </header>

    <div class="flex-1 p-2 space-y-2">
      <p
        v-if="sortedLessons.length === 0"
        class="text-xs text-slate text-center py-6 px-2 leading-relaxed"
      >
        Занятий нет.
      </p>
      <LessonCard
        v-for="lesson in sortedLessons"
        :key="lesson.id"
        :lesson="lesson"
        @select="emit('select-lesson', $event)"
      />
    </div>
  </div>
</template>
