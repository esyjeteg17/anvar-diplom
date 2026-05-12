<script setup lang="ts">
/**
 * Блок контактных данных школы — телефон + ВКонтакте + время работы.
 * Используется в секции «Контакты». Содержимое вынесено в массив
 * `contactItems`, чтобы добавить или поменять контакт можно было одной строкой.
 */

interface ContactItem {
  /** Подпись (роль контакта) */
  label: string
  /** Отображаемое значение */
  value: string
  /** Куда ведёт кнопка (tel:..., https://..., mailto:...) */
  href: string
  /** Имя иконки для рендера */
  icon: "phone" | "vk" | "clock"
}

const contactItems: ContactItem[] = [
  {
    label: "Позвоните нам",
    value: "+7 (919) 142-61-66",
    href: "tel:+79191426166",
    icon: "phone",
  },
  {
    label: "Мы в социальных сетях",
    value: "Группа ВКонтакте",
    href: "https://vk.com/sborika",
    icon: "vk",
  },
  {
    label: "Время работы",
    value: "Ежедневно, 10:00 – 20:00",
    href: "#",
    icon: "clock",
  },
]
</script>

<template>
  <div class="space-y-4">
    <a
      v-for="item in contactItems"
      :key="item.label"
      :href="item.href"
      :target="item.href.startsWith('http') ? '_blank' : '_self'"
      :rel="item.href.startsWith('http') ? 'noopener' : ''"
      class="group flex items-center gap-4 rounded-2xl bg-white border border-line/60 p-4 sm:p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      <!-- Иконка-плашка с шестерёнкой/телефоном/часами -->
      <span
        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand"
      >
        <!-- Телефон -->
        <svg
          v-if="item.icon === 'phone'"
          xmlns="http://www.w3.org/2000/svg"
          width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
        </svg>
        <!-- ВКонтакте -->
        <svg
          v-else-if="item.icon === 'vk'"
          xmlns="http://www.w3.org/2000/svg"
          width="22" height="22" viewBox="0 0 24 24" fill="currentColor"
          aria-hidden="true"
        >
          <path d="M13.16 17.27c-5.5 0-8.64-3.78-8.77-10.06h2.76c.09 4.61 2.13 6.57 3.74 6.97V7.21h2.6v3.97c1.59-.17 3.26-1.97 3.82-3.97h2.6a7.54 7.54 0 0 1-3.49 4.92c1.94 1 3.6 2.74 4.18 4.95h-2.86c-.45-1.41-1.96-3.04-4.25-3.21v3.4Z" />
        </svg>
        <!-- Часы -->
        <svg
          v-else-if="item.icon === 'clock'"
          xmlns="http://www.w3.org/2000/svg"
          width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </span>

      <div class="flex-1">
        <p class="text-xs sm:text-sm text-slate font-medium mb-0.5">
          {{ item.label }}
        </p>
        <p class="text-base sm:text-lg font-bold text-ink group-hover:text-brand transition-colors">
          {{ item.value }}
        </p>
      </div>

      <!-- Стрелочка-указатель, что элемент кликабелен -->
      <svg
        v-if="item.href !== '#'"
        xmlns="http://www.w3.org/2000/svg"
        width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="text-slate group-hover:text-brand transition-colors"
        aria-hidden="true"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </a>
  </div>
</template>
