<script setup lang="ts">
/**
 * Универсальная обёртка над input/textarea с label и сообщением об ошибке.
 * Через `v-model` передаёт значение, а через проп `error` показывает текст ошибки.
 * Тип поля выбирается через `type` ("text" / "tel" / "email" / "textarea").
 */

const props = withDefaults(
  defineProps<{
    /** Текст label */
    label: string
    /** Идентификатор поля (для связки label ↔ input через for/id) */
    id: string
    /** Тип input. textarea — рендерит <textarea> */
    type?: "text" | "tel" | "email" | "textarea"
    /** Значение (через v-model) */
    modelValue: string
    /** Placeholder */
    placeholder?: string
    /** Сообщение об ошибке (показывается под полем) */
    error?: string
    /** Поле обязательно (помечается звёздочкой в label) */
    required?: boolean
    /** autocomplete-атрибут */
    autocomplete?: string
  }>(),
  {
    type: "text",
    required: false,
  },
)

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  emit("update:modelValue", target.value)
}

const baseInputClass = computed(() => [
  "w-full rounded-xl border-2 px-4 py-3 text-base text-ink placeholder:text-slate/60",
  "transition-colors duration-150 focus:outline-none",
  props.error
    ? "border-brand bg-brand/5 focus:border-brand"
    : "border-line bg-white focus:border-brand",
])
</script>

<template>
  <div>
    <label :for="id" class="block text-sm font-semibold text-ink mb-1.5">
      {{ label }}
      <span v-if="required" class="text-brand">*</span>
    </label>

    <textarea
      v-if="type === 'textarea'"
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :class="[baseInputClass, 'min-h-[120px] resize-y']"
      @input="onInput"
    />
    <input
      v-else
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :autocomplete="autocomplete"
      :class="baseInputClass"
      @input="onInput"
    />

    <p v-if="error" class="mt-1.5 text-sm text-brand font-medium">
      {{ error }}
    </p>
  </div>
</template>
