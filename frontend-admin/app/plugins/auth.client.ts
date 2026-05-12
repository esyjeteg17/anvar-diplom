/**
 * Плагин-инициализатор: при загрузке клиентской части пытаемся получить
 * данные пользователя через /api/auth/me/. Если сессионная кука есть и
 * валидна — пользователь сразу авторизован, иначе middleware отправит на /login.
 */

import { useAuthStore } from "~/stores/auth"

export default defineNuxtPlugin(async () => {
  const auth = useAuthStore()
  await auth.bootstrap()
})
