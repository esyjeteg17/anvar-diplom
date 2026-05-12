from django.urls import include, path

from .auth_views import login_view, logout_view, me_view

# Корневой роутер API. Под /api/ монтируются все доменные приложения.
urlpatterns = [
    # Аутентификация (Django session). Фронт-админка использует эти ручки.
    path("auth/login/", login_view, name="auth-login"),
    path("auth/logout/", logout_view, name="auth-logout"),
    path("auth/me/", me_view, name="auth-me"),

    # Доменные приложения
    path("leads/", include("apps.leads.urls")),
    path("centers/", include("apps.centers.urls")),
    path("staff/", include("apps.staff.urls")),
    path("children/", include("apps.children.urls")),
    path("lessons/", include("apps.lessons.urls")),
    path("finance/", include("apps.finance.urls")),
    path("equipment/", include("apps.equipment.urls")),
]
