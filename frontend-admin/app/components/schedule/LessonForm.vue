<script setup lang="ts">
/**
 * Форма занятия — единая для создания и редактирования.
 *
 * При редактировании показывает блок посещаемости: список детей выбранного
 * центра с чекбоксами «был» и комментариями. Каждое посещение автосохраняется
 * по событию (см. AttendanceRow) — без отдельной кнопки «Сохранить посещаемость».
 *
 * Сабмит делегируется наверх — родитель (страница) решает create/update.
 */

import type { Attendance, Lesson, LessonInput } from "~/stores/lessons"

const props = defineProps<{
  /** Существующее занятие (null = создание новое) */
  initial: Lesson | null
  /** Дата по умолчанию при создании (YYYY-MM-DD) */
  defaultDate?: string
  /** Внешний fieldError(name) → string | undefined */
  fieldError?: (name: string) => string | undefined
  saving?: boolean
}>()

const emit = defineEmits<{
  (e: "submit", payload: LessonInput): void
  (e: "cancel"): void
  (e: "delete"): void
}>()

const centers = useCentersStore()
const staff = useStaffStore()
const childrenStore = useChildrenStore()

onMounted(async () => {
  await Promise.all([
    centers.fetchAll(),
    staff.fetchAll(),
    childrenStore.fetchAll(),
  ])
})

// Поля формы — заполняем из initial при редактировании.
const centerId = ref<number | null>(props.initial?.center ?? null)
const teacherId = ref<number | null>(props.initial?.teacher ?? null)
const date = ref<string>(props.initial?.date ?? props.defaultDate ?? "")
const startTime = ref<string>(
  // На бэке HH:MM:SS, инпут type=time принимает HH:MM.
  props.initial?.start_time ? props.initial.start_time.slice(0, 5) : "16:00",
)
const durationMin = ref<number>(props.initial?.duration_min ?? 60)
const topic = ref<string>(props.initial?.topic ?? "")
const description = ref<string>(props.initial?.description ?? "")
const conducted = ref<boolean>(props.initial?.conducted ?? false)

/** Дети выбранного центра — для блока посещаемости. */
const childrenInCenter = computed(() => {
  if (!centerId.value) return []
  return childrenStore.items.filter(
    (c) => c.is_active && c.center === centerId.value,
  )
})

/** Карта attendance по child_id — для быстрого доступа в шаблоне. */
const attendanceByChild = computed<Record<number, Attendance>>(() => {
  const map: Record<number, Attendance> = {}
  if (!props.initial) return map
  for (const a of props.initial.attendances) {
    map[a.child] = a
  }
  return map
})

function onSubmit() {
  if (!centerId.value || !date.value || !startTime.value) return
  emit("submit", {
    center: centerId.value,
    teacher: teacherId.value,
    date: date.value,
    start_time: startTime.value,
    duration_min: durationMin.value,
    topic: topic.value,
    description: description.value,
    conducted: conducted.value,
  })
}
</script>

<template>
  <form class="space-y-5" @submit.prevent="onSubmit">
    <!-- Центр + преподаватель -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <SelectField
        id="lesson-center"
        v-model="centerId"
        label="Центр"
        :options="centers.options"
        placeholder="— выберите —"
        required
        :error="fieldError?.('center')"
      />
      <SelectField
        id="lesson-teacher"
        v-model="teacherId"
        label="Преподаватель"
        :options="staff.teacherOptions"
        placeholder="— не назначен —"
        :error="fieldError?.('teacher')"
      />
    </div>

    <!-- Дата + время + длительность -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <FormField
        id="lesson-date"
        v-model="date"
        type="text"
        label="Дата (ГГГГ-ММ-ДД)"
        placeholder="2026-05-12"
        required
        :error="fieldError?.('date')"
      />
      <FormField
        id="lesson-time"
        v-model="startTime"
        type="text"
        label="Время начала (ЧЧ:ММ)"
        placeholder="16:30"
        required
        :error="fieldError?.('start_time')"
      />
      <FormField
        id="lesson-duration"
        v-model.number="durationMin"
        type="text"
        label="Длительность, мин"
        :error="fieldError?.('duration_min')"
      />
    </div>

    <!-- Тема + описание -->
    <FormField
      id="lesson-topic"
      v-model="topic"
      label="Тема занятия"
      placeholder="Например: «Робот-сортировщик. Программирование датчика цвета»"
      :error="fieldError?.('topic')"
    />
    <FormField
      id="lesson-description"
      v-model="description"
      type="textarea"
      label="План / описание (опционально)"
      :error="fieldError?.('description')"
    />

    <label class="inline-flex items-center gap-2 text-sm font-semibold text-ink cursor-pointer">
      <input
        v-model="conducted"
        type="checkbox"
        class="h-5 w-5 rounded border-2 border-line text-brand focus:ring-brand"
      />
      Занятие проведено
    </label>

    <!-- Блок посещаемости — только при редактировании существующего занятия,
         потому что нужно уметь дёргать API attendance с реальным lesson.id. -->
    <section v-if="initial" class="rounded-2xl border border-line/60 bg-bg/40 p-4">
      <h4 class="text-sm font-bold text-ink uppercase tracking-wider mb-3">
        Посещаемость
      </h4>

      <p
        v-if="!centerId || childrenInCenter.length === 0"
        class="text-sm text-slate text-center py-3"
      >
        В выбранном центре пока нет активных детей.
      </p>

      <div v-else class="divide-y divide-line/60">
        <AttendanceRow
          v-for="child in childrenInCenter"
          :key="child.id"
          :lesson-id="initial.id"
          :child-id="child.id"
          :child-name="child.full_name"
          :attendance="attendanceByChild[child.id] ?? null"
        />
      </div>
    </section>

    <!-- Действия формы -->
    <div class="flex justify-between gap-3 pt-2">
      <BrandButton
        v-if="initial"
        variant="ghost"
        size="md"
        type="button"
        class="!text-brand"
        @click="emit('delete')"
      >
        Удалить занятие
      </BrandButton>
      <span v-else />

      <div class="flex gap-3">
        <BrandButton variant="ghost" size="md" type="button" @click="emit('cancel')">
          Отмена
        </BrandButton>
        <BrandButton variant="primary" size="md" type="submit" :disabled="saving">
          {{ saving ? "Сохраняем…" : "Сохранить" }}
        </BrandButton>
      </div>
    </div>
  </form>
</template>
