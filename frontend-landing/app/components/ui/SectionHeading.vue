<script setup lang="ts">
/**
 * Заголовок секции — единый стиль для всех секций лендинга.
 * Состоит из (опциональной) надстрочной мелкой подписи `eyebrow`,
 * крупного заголовка `title` и (опционального) подзаголовка `description`.
 */

withDefaults(
  defineProps<{
    /** Главный заголовок секции */
    title: string
    /** Подстрочный пояснительный текст */
    description?: string
    /** Надстрочная мелкая подпись (опционально) */
    eyebrow?: string
    /** Выравнивание */
    align?: "left" | "center"
    /** Цветовая схема: на светлом фоне или на тёмном */
    theme?: "light" | "dark"
  }>(),
  {
    align: "center",
    theme: "light",
  },
)
</script>

<template>
  <div
    :class="[
      'mb-12 md:mb-16',
      align === 'center' ? 'text-center mx-auto max-w-3xl' : 'text-left max-w-2xl',
    ]"
  >
    <!-- Эйрбрау с маленькой вращающейся шестерёнкой — единый стиль маркера секций. -->
    <div
      v-if="eyebrow"
      :class="[
        'mb-3 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand',
        align === 'center' ? 'justify-self-center' : '',
      ]"
    >
      <IconGear :size="20" color="brand" :hole-radius="30" :spin="10" />
      <span>{{ eyebrow }}</span>
      <IconGear :size="20" color="brand" :hole-radius="30" :spin="10" />
    </div>
    <h2
      :class="[
        'text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight',
        theme === 'dark' ? 'text-white' : 'text-ink',
      ]"
    >
      {{ title }}
    </h2>
    <p
      v-if="description"
      :class="[
        'mt-5 text-base sm:text-lg leading-relaxed',
        theme === 'dark' ? 'text-line' : 'text-slate',
      ]"
    >
      {{ description }}
    </p>
  </div>
</template>
