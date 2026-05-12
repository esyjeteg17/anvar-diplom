<script setup lang="ts">
/**
 * Диалог подтверждения. Открывается через v-model, при подтверждении
 * эмитит событие confirm; при отмене — закрывается.
 */

defineProps<{
  modelValue: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  /** "danger" — кнопка подтверждения красно-оранжевая (для удаления). */
  variant?: "default" | "danger"
}>()

const emit = defineEmits<{
  (e: "update:modelValue", v: boolean): void
  (e: "confirm"): void
}>()

function close() {
  emit("update:modelValue", false)
}

function confirm() {
  emit("confirm")
  close()
}
</script>

<template>
  <Modal :model-value="modelValue" :title="title ?? 'Подтверждение'" size="sm" @update:model-value="emit('update:modelValue', $event)">
    <p class="text-base text-ink leading-relaxed">
      <slot>{{ message }}</slot>
    </p>

    <template #footer>
      <BrandButton variant="ghost" size="md" @click="close">
        {{ cancelText ?? "Отмена" }}
      </BrandButton>
      <BrandButton
        :variant="variant === 'danger' ? 'primary' : 'primary'"
        size="md"
        @click="confirm"
      >
        {{ confirmText ?? "Подтвердить" }}
      </BrandButton>
    </template>
  </Modal>
</template>
