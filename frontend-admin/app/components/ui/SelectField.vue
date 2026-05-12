<script setup lang="ts">
/**
 * Выпадающий список с label и сообщением об ошибке.
 * Принимает массив { value, label } через проп options.
 */

interface SelectOption {
  value: string | number
  label: string
}

const props = withDefaults(
  defineProps<{
    label: string
    id: string
    modelValue: string | number | null
    options: SelectOption[]
    placeholder?: string
    error?: string
    required?: boolean
  }>(),
  { required: false },
)

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number | null): void
}>()

function onChange(event: Event) {
  const v = (event.target as HTMLSelectElement).value
  emit("update:modelValue", v === "" ? null : v)
}
</script>

<template>
  <div>
    <label :for="id" class="block text-sm font-semibold text-ink mb-1.5">
      {{ label }}
      <span v-if="required" class="text-brand">*</span>
    </label>
    <select
      :id="id"
      :value="modelValue ?? ''"
      :required="required"
      :class="[
        'w-full rounded-xl border-2 px-4 py-3 text-base text-ink bg-white transition-colors duration-150 focus:outline-none',
        error ? 'border-brand bg-brand/5 focus:border-brand' : 'border-line focus:border-brand',
      ]"
      @change="onChange"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.label }}
      </option>
    </select>
    <p v-if="error" class="mt-1.5 text-sm text-brand font-medium">
      {{ error }}
    </p>
  </div>
</template>
