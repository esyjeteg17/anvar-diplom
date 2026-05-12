<script setup lang="ts">
/**
 * Форма расхода — для создания и редактирования.
 * Дата + категория + сумма + описание. Логика отправки в родителе.
 */

import {
  EXPENSE_CATEGORIES,
  type Expense,
  type ExpenseCategory,
  type ExpenseInput,
} from "~/stores/finance"
import { formatYmd } from "~/composables/useDate"

const props = defineProps<{
  initial: Expense | null
  fieldError?: (name: string) => string | undefined
  saving?: boolean
}>()

const emit = defineEmits<{
  (e: "submit", payload: ExpenseInput): void
  (e: "cancel"): void
}>()

const date = ref<string>(props.initial?.date ?? formatYmd(new Date()))
const category = ref<ExpenseCategory>(props.initial?.category ?? "other")
const amount = ref<string>(props.initial?.amount ?? "0")
const description = ref<string>(props.initial?.description ?? "")

function onSubmit() {
  emit("submit", {
    date: date.value,
    category: category.value,
    amount: amount.value,
    description: description.value,
  })
}
</script>

<template>
  <form class="space-y-5" @submit.prevent="onSubmit">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        id="expense-date"
        v-model="date"
        type="date"
        label="Дата"
        required
        :error="fieldError?.('date')"
      />
      <SelectField
        id="expense-category"
        :model-value="category"
        :options="EXPENSE_CATEGORIES"
        label="Категория"
        required
        :error="fieldError?.('category')"
        @update:model-value="(v) => category = v as ExpenseCategory"
      />
    </div>

    <FormField
      id="expense-amount"
      v-model="amount"
      type="text"
      label="Сумма, ₽"
      required
      :error="fieldError?.('amount')"
    />

    <FormField
      id="expense-description"
      v-model="description"
      label="Описание"
      placeholder="Что это за расход?"
      :error="fieldError?.('description')"
    />

    <div class="flex justify-end gap-3 pt-2">
      <BrandButton variant="ghost" size="md" type="button" @click="emit('cancel')">
        Отмена
      </BrandButton>
      <BrandButton variant="primary" size="md" type="submit" :disabled="saving">
        {{ saving ? "Сохраняем…" : "Сохранить" }}
      </BrandButton>
    </div>
  </form>
</template>
