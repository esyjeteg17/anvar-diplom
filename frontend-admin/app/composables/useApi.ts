/**
 * useApi — обёртка над $fetch, которая всегда добавляет credentials: include
 * (нужно для session-cookie Django) и подставляет базовый URL из runtimeConfig.
 *
 * Все обращения к бэку из админки делаются через эту функцию, чтобы не
 * дублировать boilerplate в сторах.
 */

import type { FetchOptions } from "ofetch"

export function useApi() {
  const config = useRuntimeConfig()
  const base = config.public.apiBase as string

  function call<T = unknown>(path: string, options?: FetchOptions): Promise<T> {
    return $fetch<T>(`${base}${path}`, {
      // Включаем cookie-сессии (sessionid) во всех запросах.
      credentials: "include",
      ...options,
    } as any) as Promise<T>
  }

  return { call }
}
