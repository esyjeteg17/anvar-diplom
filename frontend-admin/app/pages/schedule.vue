<script setup lang="ts">
/**
 * Страница «Расписание» — недельный календарь занятий + форма с посещаемостью.
 *
 * 7 столбцов-дней. В каждом — карточки занятий (LessonCard).
 * Клик «+» в шапке дня → создание нового занятия с предзаполненной датой.
 * Клик по карточке → редактирование, в форме можно отмечать посещаемость
 * детей выбранного центра (автосохранение).
 */

import { addDays, formatYmd, startOfWeek } from "~/composables/useDate"
import type { Lesson, LessonInput } from "~/stores/lessons"

useHead({ title: "SBORIKA — Расписание" })

const lessonsStore = useLessonsStore()

const weekStart = ref<Date>(startOfWeek(new Date()))

const weekDays = computed<Date[]>(() =>
  Array.from({ length: 7 }, (_, i) => addDays(weekStart.value, i)),
)

/** Занятия, сгруппированные по строке-дате YYYY-MM-DD. */
const lessonsByDate = computed<Record<string, Lesson[]>>(() => {
  const map: Record<string, Lesson[]> = {}
  for (const lesson of lessonsStore.items) {
    if (!map[lesson.date]) map[lesson.date] = []
    map[lesson.date]!.push(lesson)
  }
  return map
})

async function reload() {
  const from = formatYmd(weekStart.value)
  const to = formatYmd(addDays(weekStart.value, 6))
  await lessonsStore.fetchPeriod(from, to)
}

watch(weekStart, () => reload(), { immediate: true })

// Модалка создания/редактирования
const formOpen = ref<boolean>(false)
const editingLesson = ref<Lesson | null>(null)
const formDate = ref<string>("")

function openCreate(date: Date) {
  editingLesson.value = null
  formDate.value = formatYmd(date)
  lessonsStore.resetErrors()
  formOpen.value = true
}

function openEdit(lesson: Lesson) {
  editingLesson.value = lesson
  formDate.value = lesson.date
  lessonsStore.resetErrors()
  formOpen.value = true
}

async function onSubmit(payload: LessonInput) {
  const saved = editingLesson.value
    ? await lessonsStore.update(editingLesson.value.id, payload)
    : await lessonsStore.create(payload)

  if (saved) {
    if (!editingLesson.value) {
      // После создания подменяем initial — это переключает форму в режим
      // редактирования и открывает блок посещаемости (нужен реальный lesson.id).
      editingLesson.value = saved
    } else {
      formOpen.value = false
    }
  }
}

// Удаление
const deleteOpen = ref<boolean>(false)

function askDelete() {
  deleteOpen.value = true
}

async function confirmDelete() {
  if (!editingLesson.value) return
  const ok = await lessonsStore.remove(editingLesson.value.id)
  if (ok) {
    formOpen.value = false
    editingLesson.value = null
  }
}
</script>

<template>
  <AdminPage
    title="Расписание"
    description="Календарь занятий по неделям. Тема, проведение и посещаемость каждого ребёнка."
  >
    <WeekNav v-model="weekStart" />

    <!-- 7 дней. На мобильных — вертикально, на десктопе — 7 колонок. -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
      <DayColumn
        v-for="day in weekDays"
        :key="formatYmd(day)"
        :date="day"
        :lessons="lessonsByDate[formatYmd(day)] ?? []"
        @add-lesson="openCreate"
        @select-lesson="openEdit"
      />
    </div>

    <p v-if="lessonsStore.loading" class="mt-4 text-sm text-slate text-center">
      Загрузка…
    </p>
    <p v-else-if="lessonsStore.errorText" class="mt-4 text-sm font-medium text-brand text-center">
      {{ lessonsStore.errorText }}
    </p>

    <!-- Модалка занятия -->
    <Modal
      v-model="formOpen"
      :title="editingLesson ? 'Редактировать занятие' : 'Новое занятие'"
      size="lg"
    >
      <LessonForm
        :initial="editingLesson"
        :default-date="formDate"
        :field-error="lessonsStore.fieldError"
        :saving="lessonsStore.saving"
        @submit="onSubmit"
        @cancel="formOpen = false"
        @delete="askDelete"
      />
    </Modal>

    <!-- Подтверждение удаления -->
    <ConfirmDialog
      v-model="deleteOpen"
      title="Удалить занятие?"
      message="Само занятие и все отметки посещаемости по нему будут удалены."
      confirm-text="Удалить"
      variant="danger"
      @confirm="confirmDelete"
    />
  </AdminPage>
</template>
