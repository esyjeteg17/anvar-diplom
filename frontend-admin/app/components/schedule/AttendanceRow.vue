<script setup lang="ts">
/**
 * Строка посещаемости одного ребёнка в форме занятия.
 * Чекбокс «был» + поле комментария + автосохранение через стор lessons.
 *
 * Изменения сохраняются по `change` чекбокса и `blur` инпута,
 * чтобы не делать запрос на каждое нажатие клавиши.
 */

import type { Attendance } from "~/stores/lessons"

const props = defineProps<{
  /** ID занятия — нужен для сохранения */
  lessonId: number
  /** ID ребёнка */
  childId: number
  /** ФИ ребёнка для отображения */
  childName: string
  /** Текущая запись посещаемости (или null = нет записи) */
  attendance: Attendance | null
}>()

const lessons = useLessonsStore()

const present = ref<boolean>(props.attendance?.present ?? false)
const comment = ref<string>(props.attendance?.comment ?? "")
const savingState = ref<"idle" | "saving" | "saved" | "error">("idle")

// Реактивно подхватываем изменения снаружи (например, когда attendance впервые
// создалась после первого сохранения и пришла обратно из стора).
watch(
  () => props.attendance,
  (a) => {
    if (a) {
      present.value = a.present
      comment.value = a.comment
    }
  },
)

let saveTimer: ReturnType<typeof setTimeout> | null = null

async function persist() {
  if (saveTimer) clearTimeout(saveTimer)
  savingState.value = "saving"
  const saved = await lessons.saveAttendance({
    lesson: props.lessonId,
    child: props.childId,
    present: present.value,
    comment: comment.value,
  })
  if (saved) {
    savingState.value = "saved"
    saveTimer = setTimeout(() => (savingState.value = "idle"), 1200)
  } else {
    savingState.value = "error"
  }
}

onBeforeUnmount(() => {
  if (saveTimer) clearTimeout(saveTimer)
})
</script>

<template>
  <div class="flex items-start gap-3 py-2.5 px-2 rounded-lg hover:bg-bg/60 transition-colors">
    <label class="flex items-center pt-2.5 cursor-pointer">
      <input
        v-model="present"
        type="checkbox"
        class="h-5 w-5 rounded border-2 border-line text-brand focus:ring-brand"
        @change="persist"
      />
    </label>

    <div class="flex-1 min-w-0">
      <div class="text-sm font-semibold text-ink mb-1">
        {{ childName }}
      </div>
      <input
        v-model="comment"
        type="text"
        placeholder="Комментарий (опоздал, плохо себя чувствовал, отлично работал…)"
        class="w-full rounded-lg border border-line bg-white px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-brand transition-colors"
        @blur="persist"
        @keydown.enter.prevent="persist"
      />
    </div>

    <span
      class="shrink-0 text-xs font-medium pt-2"
      :class="{
        'text-slate': savingState === 'idle',
        'text-brand': savingState === 'saving' || savingState === 'error',
        'text-green-600': savingState === 'saved',
      }"
    >
      <template v-if="savingState === 'saving'">сохраняю…</template>
      <template v-else-if="savingState === 'saved'">✓</template>
      <template v-else-if="savingState === 'error'">ошибка</template>
    </span>
  </div>
</template>
