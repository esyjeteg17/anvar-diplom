<script setup lang="ts">
/**
 * Список тезисов с маркером-шестерёнкой перед каждым пунктом.
 * Используется в секции «Занятия» (две колонки), может пригодиться в других местах,
 * где нужно «галочка + текст». Цвет маркера, заголовок и оформление панели —
 * через пропсы, чтобы один компонент покрывал все варианты.
 */

type GearColor = "brand" | "slate" | "ink" | "white" | "line"
type Variant = "plain" | "panel-light" | "panel-slate"

withDefaults(
  defineProps<{
    /** Заголовок над списком (опционально) */
    title?: string
    /** Пункты списка — массив строк */
    items: string[]
    /** Цвет маркеров-шестерёнок */
    iconColor?: GearColor
    /** Оформление: без панели / на белой панели / на сине-серой панели */
    variant?: Variant
  }>(),
  {
    iconColor: "brand",
    variant: "panel-light",
  },
)

const variantClasses: Record<Variant, string> = {
  plain: "",
  "panel-light": "bg-white border border-line/60 shadow-sm rounded-2xl p-6 md:p-8",
  "panel-slate": "bg-slate text-white rounded-2xl p-6 md:p-8",
}
</script>

<template>
  <div :class="[variantClasses[variant ?? 'panel-light']]">
    <h3
      v-if="title"
      :class="[
        'text-lg sm:text-xl font-bold mb-5',
        variant === 'panel-slate' ? 'text-white' : 'text-ink',
      ]"
    >
      {{ title }}
    </h3>
    <ul class="space-y-4">
      <li
        v-for="(text, i) in items"
        :key="i"
        class="flex items-start gap-3"
      >
        <!-- Маркер-шестерёнка вместо классического буллета -->
        <IconGear
          :size="22"
          :color="iconColor"
          :hole-radius="30"
          class="shrink-0 mt-1"
        />
        <span
          :class="[
            'text-sm sm:text-base leading-relaxed',
            variant === 'panel-slate' ? 'text-line' : 'text-ink',
          ]"
        >
          {{ text }}
        </span>
      </li>
    </ul>
  </div>
</template>
