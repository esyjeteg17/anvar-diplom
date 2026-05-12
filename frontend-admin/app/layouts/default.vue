<script setup lang="ts">
/**
 * Основной layout админки: фиксированный sidebar слева + контентная область справа.
 * Используется на всех страницах кроме /login (там layout=auth, заглушка).
 */

import { useAuthStore } from "~/stores/auth"

const auth = useAuthStore()
const route = useRoute()

interface NavItem {
  to: string
  label: string
  icon: "money" | "calendar" | "users" | "box"
}

const navItems: NavItem[] = [
  { to: "/finance",   label: "Финансы",      icon: "money" },
  { to: "/schedule",  label: "Расписание",   icon: "calendar" },
  { to: "/children",  label: "Дети",         icon: "users" },
  { to: "/equipment", label: "Оборудование", icon: "box" },
]

async function onLogout() {
  await auth.logout()
  await navigateTo("/login")
}
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Боковое меню -->
    <aside class="hidden md:flex md:w-64 lg:w-72 flex-col border-r border-line/60 bg-white">
      <!-- Логотип SBORIKA — тот же компонент, что на лендинге. -->
      <div class="px-6 py-6 border-b border-line/60">
        <NuxtLink to="/finance" class="inline-block">
          <BrandLogo size="md" />
        </NuxtLink>
        <p class="mt-2 text-xs text-slate font-medium">Админ-панель</p>
      </div>

      <!-- Пункты меню -->
      <nav class="flex-1 p-4 space-y-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="[
            'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
            route.path.startsWith(item.to)
              ? 'bg-brand text-white shadow-sm'
              : 'text-ink hover:bg-line/60',
          ]"
        >
          <!-- Иконки секций -->
          <svg
            v-if="item.icon === 'money'"
            xmlns="http://www.w3.org/2000/svg"
            width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            aria-hidden="true"
          >
            <line x1="12" y1="2" x2="12" y2="22" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <svg
            v-else-if="item.icon === 'calendar'"
            xmlns="http://www.w3.org/2000/svg"
            width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <svg
            v-else-if="item.icon === 'users'"
            xmlns="http://www.w3.org/2000/svg"
            width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <svg
            v-else-if="item.icon === 'box'"
            xmlns="http://www.w3.org/2000/svg"
            width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <!-- Низ сайдбара: кто залогинен + кнопка выхода -->
      <div class="border-t border-line/60 p-4">
        <p class="text-xs text-slate mb-1">Вы вошли как</p>
        <p class="text-sm font-bold text-ink mb-3">{{ auth.user?.username }}</p>
        <button
          type="button"
          class="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-ink hover:bg-line/60 transition-colors"
          @click="onLogout"
        >
          Выйти
        </button>
      </div>
    </aside>

    <!-- Контент -->
    <main class="flex-1 overflow-x-hidden">
      <slot />
    </main>

    <!-- Глобальный контейнер toast-уведомлений (правый нижний угол страницы). -->
    <ToastContainer />
  </div>
</template>
