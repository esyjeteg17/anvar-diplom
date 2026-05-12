<script setup lang="ts">
/**
 * Страница «Оборудование» — простой счётчик.
 *
 * Сверху одна большая карточка «Всего единиц», ниже — три карточки
 * по типам (наборы / планшеты / подставки) с крупным числом и кнопками
 * −1 / +1. Никаких центров и инвентарных номеров — школа маленькая,
 * этого достаточно.
 */

import { EQUIPMENT_TYPES, type EquipmentType } from "~/stores/equipment"

useHead({ title: "SBORIKA — Оборудование" })

const equipment = useEquipmentStore()

onMounted(() => equipment.fetchAll())

/** Получить количество по типу — 0 если запись ещё не подгрузилась. */
function quantityOf(type: EquipmentType): number {
  return equipment.findByType(type)?.quantity ?? 0
}
</script>

<template>
  <AdminPage
    title="Оборудование"
    description="Учёт количества оборудования: наборы-конструкторы, планшеты, подставки."
  >
    <!-- Большая карточка «Всего единиц» -->
    <div class="rounded-2xl bg-white border border-line/60 shadow-sm p-6 sm:p-8 mb-6 text-center">
      <p class="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate mb-2">
        Всего единиц
      </p>
      <p class="text-5xl sm:text-6xl font-black text-ink tabular-nums">
        {{ equipment.grandTotal }}
      </p>
    </div>

    <!-- Три карточки-счётчика. Один и тот же шаблон, варьируется тип. -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
      <article
        v-for="t in EQUIPMENT_TYPES"
        :key="t.value"
        class="rounded-2xl bg-white border border-line/60 shadow-sm p-6 sm:p-7"
      >
        <p class="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate mb-2">
          {{ t.label }}
        </p>

        <!-- Крупное число -->
        <p class="text-5xl sm:text-6xl font-black text-brand tabular-nums leading-none mb-5">
          {{ quantityOf(t.value) }}
        </p>

        <!-- Кнопки -1 / +1 -->
        <div class="flex items-stretch gap-3">
          <button
            type="button"
            class="flex-1 flex items-center justify-center rounded-xl border-2 border-line bg-white py-3 text-2xl font-black text-ink hover:border-brand hover:text-brand active:scale-95 transition-all"
            :disabled="quantityOf(t.value) === 0"
            :class="{ 'opacity-40 cursor-not-allowed': quantityOf(t.value) === 0 }"
            @click="equipment.adjust(t.value, -1)"
            aria-label="Убавить"
          >
            −
          </button>
          <button
            type="button"
            class="flex-1 flex items-center justify-center rounded-xl bg-brand py-3 text-2xl font-black text-white shadow-sm hover:bg-[#d24f15] active:scale-95 transition-all"
            @click="equipment.adjust(t.value, 1)"
            aria-label="Прибавить"
          >
            +
          </button>
        </div>
      </article>
    </div>

    <p v-if="equipment.errorText" class="mt-4 text-sm font-medium text-brand">
      {{ equipment.errorText }}
    </p>
  </AdminPage>
</template>
