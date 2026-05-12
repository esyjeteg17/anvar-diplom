<script setup lang="ts">
/**
 * Форма создания/редактирования ребёнка. Держит локальное состояние полей,
 * получает initial-данные через проп для режима редактирования,
 * сабмит делегирует наверх (родитель решает: create или update).
 *
 * Список центров — из useCentersStore (один раз грузится при монтировании).
 */

import type { Child, ChildInput } from "~/stores/children"

const props = defineProps<{
  /** Данные ребёнка для режима редактирования (null = создание). */
  initial: Child | null
  /** Внешняя fieldError(name) → string | undefined (приходит из стора). */
  fieldError?: (name: string) => string | undefined
  /** Идёт ли отправка — блокирует кнопку. */
  saving?: boolean
}>()

const emit = defineEmits<{
  (e: "submit", payload: ChildInput): void
  (e: "cancel"): void
}>()

const centers = useCentersStore()

onMounted(async () => {
  await centers.fetchAll()
})

// Локальные поля формы. Заполняются из initial при редактировании.
const firstName = ref<string>(props.initial?.first_name ?? "")
const lastName = ref<string>(props.initial?.last_name ?? "")
const birthDate = ref<string>(props.initial?.birth_date ?? "")
const parentFirstName = ref<string>(props.initial?.parent_first_name ?? "")
const parentLastName = ref<string>(props.initial?.parent_last_name ?? "")
const parentPhone = ref<string>(props.initial?.parent_phone ?? "")
const parentTelegram = ref<string>(props.initial?.parent_telegram ?? "")
const parentVk = ref<string>(props.initial?.parent_vk ?? "")
const centerId = ref<number | null>(props.initial?.center ?? null)
const monthlyFee = ref<string>(props.initial?.monthly_fee ?? "0")
const isActive = ref<boolean>(props.initial?.is_active ?? true)
const notes = ref<string>(props.initial?.notes ?? "")

function onSubmit() {
  if (!centerId.value) return
  emit("submit", {
    first_name: firstName.value,
    last_name: lastName.value,
    birth_date: birthDate.value || null,
    parent_first_name: parentFirstName.value,
    parent_last_name: parentLastName.value,
    parent_phone: parentPhone.value,
    parent_telegram: parentTelegram.value,
    parent_vk: parentVk.value,
    center: centerId.value,
    monthly_fee: monthlyFee.value,
    is_active: isActive.value,
    notes: notes.value,
  })
}
</script>

<template>
  <form class="space-y-5" @submit.prevent="onSubmit">
    <!-- Ребёнок -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        id="child-last-name"
        v-model="lastName"
        label="Фамилия ребёнка"
        required
        :error="fieldError?.('last_name')"
      />
      <FormField
        id="child-first-name"
        v-model="firstName"
        label="Имя ребёнка"
        required
        :error="fieldError?.('first_name')"
      />
    </div>

    <FormField
      id="child-birth-date"
      v-model="birthDate"
      type="text"
      label="Дата рождения (ГГГГ-ММ-ДД)"
      placeholder="2018-04-15"
      :error="fieldError?.('birth_date')"
    />

    <SelectField
      id="child-center"
      v-model="centerId"
      label="Центр"
      placeholder="— выберите центр —"
      :options="centers.options"
      required
      :error="fieldError?.('center')"
    />

    <!-- Родитель -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        id="parent-last-name"
        v-model="parentLastName"
        label="Фамилия родителя"
        :error="fieldError?.('parent_last_name')"
      />
      <FormField
        id="parent-first-name"
        v-model="parentFirstName"
        label="Имя родителя"
        required
        :error="fieldError?.('parent_first_name')"
      />
    </div>

    <FormField
      id="parent-phone"
      v-model="parentPhone"
      type="tel"
      label="Телефон родителя"
      placeholder="+7 (___) ___-__-__"
      required
      :error="fieldError?.('parent_phone')"
    />

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        id="parent-telegram"
        v-model="parentTelegram"
        label="Telegram"
        placeholder="@username"
        :error="fieldError?.('parent_telegram')"
      />
      <FormField
        id="parent-vk"
        v-model="parentVk"
        label="ВКонтакте (URL)"
        placeholder="https://vk.com/id..."
        :error="fieldError?.('parent_vk')"
      />
    </div>

    <!-- Финансы / прочее -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        id="child-fee"
        v-model="monthlyFee"
        label="Стоимость месяца, ₽"
        :error="fieldError?.('monthly_fee')"
      />
      <div class="flex items-center pt-7">
        <label class="inline-flex items-center gap-2 text-sm font-medium text-ink cursor-pointer">
          <input
            v-model="isActive"
            type="checkbox"
            class="h-5 w-5 rounded border-2 border-line text-brand focus:ring-brand"
          />
          Занимается сейчас
        </label>
      </div>
    </div>

    <FormField
      id="child-notes"
      v-model="notes"
      type="textarea"
      label="Комментарий"
      :error="fieldError?.('notes')"
    />

    <!-- Кнопки внутри формы — для удобства работы с Enter -->
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
