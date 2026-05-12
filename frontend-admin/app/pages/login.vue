<script setup lang="ts">
/**
 * Страница входа в админ-панель.
 * Простая форма с логином и паролем, отправка через стор useAuthStore.
 */

import { useAuthStore } from "~/stores/auth"

definePageMeta({ layout: "auth" })
useHead({ title: "SBORIKA — Вход в админку" })

const auth = useAuthStore()
const route = useRoute()

const username = ref<string>("")
const password = ref<string>("")

async function onSubmit() {
  const ok = await auth.login(username.value, password.value)
  if (ok) {
    // Если пришли с ?next=... — возвращаемся туда, иначе на финансы.
    const next = (route.query.next as string) || "/finance"
    await navigateTo(next, { replace: true })
  }
}
</script>

<template>
  <div class="w-full max-w-md">
    <!-- Логотип бренда — тот же компонент, что используется на лендинге. -->
    <div class="mb-8 flex flex-col items-center">
      <BrandLogo size="lg" />
      <p class="mt-3 text-sm text-slate font-medium">Вход в админ-панель</p>
    </div>

    <form
      class="space-y-4 rounded-2xl bg-white border border-line/60 shadow-sm p-6 sm:p-8"
      @submit.prevent="onSubmit"
    >
      <div>
        <label for="username" class="block text-sm font-semibold text-ink mb-1.5">
          Логин
        </label>
        <input
          id="username"
          v-model="username"
          type="text"
          autocomplete="username"
          required
          class="w-full rounded-xl border-2 border-line bg-white px-4 py-3 text-base text-ink focus:outline-none focus:border-brand transition-colors"
        />
      </div>
      <div>
        <label for="password" class="block text-sm font-semibold text-ink mb-1.5">
          Пароль
        </label>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
          class="w-full rounded-xl border-2 border-line bg-white px-4 py-3 text-base text-ink focus:outline-none focus:border-brand transition-colors"
        />
      </div>

      <p v-if="auth.errorText" class="text-sm font-medium text-brand">
        {{ auth.errorText }}
      </p>

      <button
        type="submit"
        :disabled="auth.loading"
        class="w-full rounded-xl bg-brand px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#d24f15] active:bg-[#bb4612] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ auth.loading ? "Входим…" : "Войти" }}
      </button>
    </form>
  </div>
</template>
