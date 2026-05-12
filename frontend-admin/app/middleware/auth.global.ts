/**
 * Глобальный middleware: если пользователь не залогинен — отправляем его
 * на /login. Страница логина исключение, на неё пускаем без авторизации.
 */

import { useAuthStore } from "~/stores/auth"

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  const publicRoutes = new Set(["/login"])

  if (publicRoutes.has(to.path)) {
    // Если уже авторизован, на /login делать нечего — отправляем на финансы.
    if (auth.isAuthenticated) {
      return navigateTo("/finance")
    }
    return
  }

  if (!auth.isAuthenticated) {
    return navigateTo({ path: "/login", query: { next: to.fullPath } })
  }
})
