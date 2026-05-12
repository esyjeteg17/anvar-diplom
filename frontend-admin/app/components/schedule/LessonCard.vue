<script setup lang="ts">
/**
 * Мини-карточка занятия в столбце дня.
 * Показывает время, центр, тему и статус (проведено / запланировано).
 * При клике эмитит `select` — родитель открывает форму редактирования.
 */

import type { Lesson } from "~/stores/lessons"

const props = defineProps<{
  lesson: Lesson
}>()

const emit = defineEmits<{
  (e: "select", lesson: Lesson): void
}>()

/** «18:30» — отрезаем секунды от строки HH:MM:SS. */
const timeShort = computed<string>(() =>
  props.lesson.start_time.slice(0, 5),
)

/** Сколько пришло детей (если занятие проведено) — для статусной строки. */
const presentCount = computed<number>(() =>
  props.lesson.attendances.filter((a) => a.present).length,
)
</script>

<template>
  <button
    type="button"
    class="group block w-full text-left rounded-xl border-l-4 px-3 py-2.5 transition-all hover:-translate-y-0.5 hover:shadow-sm"
    :class="lesson.conducted
      ? 'bg-brand/10 border-brand'
      : 'bg-white border-slate'"
    @click="emit('select', lesson)"
  >
    <div class="flex items-center justify-between gap-2 mb-0.5">
      <span class="text-sm font-bold text-ink">{{ timeShort }}</span>
      <span
        :class="[
          'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
          lesson.conducted ? 'bg-brand text-white' : 'bg-line/60 text-slate',
        ]"
      >
        {{ lesson.conducted ? "Проведено" : "Запланировано" }}
      </span>
    </div>

    <div class="text-xs text-slate mb-1 line-clamp-1">{{ lesson.center_name }}</div>

    <div class="text-sm font-semibold text-ink leading-snug line-clamp-2">
      {{ lesson.topic || "(без темы)" }}
    </div>

    <div v-if="lesson.attendances.length > 0" class="mt-1.5 text-[11px] text-slate">
      <template v-if="lesson.conducted">
        Пришло {{ presentCount }} из {{ lesson.attendances.length }}
      </template>
      <template v-else>
        В списке: {{ lesson.attendances.length }}
      </template>
    </div>
  </button>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
