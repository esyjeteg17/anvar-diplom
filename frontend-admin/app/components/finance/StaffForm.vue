<script setup lang="ts">
/**
 * Форма сотрудника. Используется на вкладке «Финансы» для управления
 * штатом и зарплатами. Логика отправки делегируется в родительскую страницу.
 */

import { type Staff, type StaffInput, STAFF_ROLES } from "~/stores/staff"

const props = defineProps<{
  initial: Staff | null
  fieldError?: (name: string) => string | undefined
  saving?: boolean
}>()

const emit = defineEmits<{
  (e: "submit", payload: StaffInput): void
  (e: "cancel"): void
}>()

const firstName = ref<string>(props.initial?.first_name ?? "")
const lastName = ref<string>(props.initial?.last_name ?? "")
const role = ref<Staff["role"]>(props.initial?.role ?? "teacher")
const phone = ref<string>(props.initial?.phone ?? "")
const email = ref<string>(props.initial?.email ?? "")
const salary = ref<string>(props.initial?.salary_per_month ?? "0")
const hireDate = ref<string>(props.initial?.hire_date ?? "")
const isActive = ref<boolean>(props.initial?.is_active ?? true)

function onSubmit() {
  emit("submit", {
    first_name: firstName.value,
    last_name: lastName.value,
    role: role.value,
    phone: phone.value,
    email: email.value,
    salary_per_month: salary.value,
    hire_date: hireDate.value || null,
    is_active: isActive.value,
  })
}
</script>

<template>
  <form class="space-y-5" @submit.prevent="onSubmit">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        id="staff-last-name"
        v-model="lastName"
        label="Фамилия"
        required
        :error="fieldError?.('last_name')"
      />
      <FormField
        id="staff-first-name"
        v-model="firstName"
        label="Имя"
        required
        :error="fieldError?.('first_name')"
      />
    </div>

    <SelectField
      id="staff-role"
      :model-value="role"
      :options="STAFF_ROLES"
      label="Роль"
      required
      :error="fieldError?.('role')"
      @update:model-value="(v) => role = v as Staff['role']"
    />

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        id="staff-phone"
        v-model="phone"
        type="tel"
        label="Телефон"
        :error="fieldError?.('phone')"
      />
      <FormField
        id="staff-email"
        v-model="email"
        type="email"
        label="Email"
        :error="fieldError?.('email')"
      />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        id="staff-salary"
        v-model="salary"
        label="Зарплата в месяц, ₽"
        required
        :error="fieldError?.('salary_per_month')"
      />
      <FormField
        id="staff-hire-date"
        v-model="hireDate"
        type="text"
        label="Дата найма (ГГГГ-ММ-ДД)"
        :error="fieldError?.('hire_date')"
      />
    </div>

    <label class="inline-flex items-center gap-2 text-sm font-semibold text-ink cursor-pointer">
      <input v-model="isActive" type="checkbox" class="h-5 w-5 rounded border-2 border-line text-brand" />
      Работает сейчас (учитывается в зарплатах)
    </label>

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
