import { defineStore } from "pinia"

/**
 * Стор авторизации админ-панели.
 * Хранит текущего пользователя (`user`), флаги загрузки и ошибки логина.
 * При старте приложения `bootstrap()` пытается получить данные через
 * /api/auth/me/ — если сессионная кука валидна, пользователь сразу залогинен.
 */

export interface AdminUser {
  id: number
  username: string
  email: string
  is_staff: boolean
  is_superuser: boolean
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<AdminUser | null>(null)
  const loading = ref<boolean>(false)
  const errorText = ref<string | null>(null)

  const isAuthenticated = computed<boolean>(() => user.value !== null)

  /** Запрос данных текущего пользователя — определяет, есть ли активная сессия. */
  async function bootstrap(): Promise<void> {
    const { call } = useApi()
    try {
      user.value = await call<AdminUser>("/auth/me/")
    } catch {
      user.value = null
    }
  }

  /** Логин по логину/паролю. При успехе кладёт пользователя в стор. */
  async function login(username: string, password: string): Promise<boolean> {
    const { call } = useApi()
    loading.value = true
    errorText.value = null
    try {
      user.value = await call<AdminUser>("/auth/login/", {
        method: "POST",
        body: { username, password },
      })
      return true
    } catch (e: any) {
      errorText.value = e?.data?.detail ?? "Не удалось войти"
      user.value = null
      return false
    } finally {
      loading.value = false
    }
  }

  /** Выход. Сбрасывает локальное состояние независимо от ответа сервера. */
  async function logout(): Promise<void> {
    const { call } = useApi()
    try {
      await call("/auth/logout/", { method: "POST" })
    } catch {
      // Игнорируем — даже если сервер недоступен, локально надо разлогиниться.
    } finally {
      user.value = null
    }
  }

  return {
    user,
    loading,
    errorText,
    isAuthenticated,
    bootstrap,
    login,
    logout,
  }
})
