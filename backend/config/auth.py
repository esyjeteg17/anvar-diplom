"""Кастомный класс аутентификации DRF — сессия без CSRF-проверки.

Стандартный SessionAuthentication требует CSRF-токен для небезопасных методов
(POST/PUT/DELETE). Для SPA-админки это неудобно, и от CSRF-атак нас и так
защищает CORS-allowlist (запросы с других доменов не пройдут даже с
учётными данными). Поэтому здесь просто отключаем enforce_csrf.
"""

from rest_framework.authentication import SessionAuthentication


class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):  # noqa: ARG002
        return None
