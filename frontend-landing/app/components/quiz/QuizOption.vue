<script setup lang="ts">
/**
 * Карточка-вариант ответа в квизе. Внешне это большая радиокнопка
 * с лёгким hover-эффектом и яркой подсветкой выбранного состояния.
 *
 * Не управляет состоянием сама — родитель (QuizQuestion) передаёт `selected`
 * и слушает событие `select`, обновляя выбор в сторе.
 */

const props = defineProps<{
  /** Текст варианта */
  label: string
  /** Выбран ли этот вариант сейчас */
  selected: boolean
}>()

const emit = defineEmits<{
  (e: "select"): void
}>()
</script>

<template>
  <button
    type="button"
    :class="[
      'group flex w-full items-center gap-4 rounded-xl border-2 px-4 py-4 sm:px-5 sm:py-4 text-left transition-all duration-150',
      selected
        ? 'border-brand bg-brand/5 shadow-sm'
        : 'border-line bg-white hover:border-brand/60 hover:-translate-y-0.5 hover:shadow-sm',
    ]"
    @click="emit('select')"
  >
    <!-- Кружок-индикатор: пустой когда не выбран, оранжевый с галочкой когда выбран -->
    <span
      :class="[
        'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all',
        selected ? 'border-brand bg-brand' : 'border-line group-hover:border-brand/60',
      ]"
    >
      <svg
        v-if="selected"
        xmlns="http://www.w3.org/2000/svg"
        width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
        class="text-white"
        aria-hidden="true"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
    <span
      :class="[
        'text-sm sm:text-base font-medium',
        selected ? 'text-ink' : 'text-ink/85',
      ]"
    >
      {{ label }}
    </span>
  </button>
</template>
