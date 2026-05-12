from django.urls import path

from .views import LeadCreateView

# Все роуты приложения. Подключается из config/api_urls.py
# с префиксом "leads/", итоговый URL: /api/leads/.
urlpatterns = [
    path("", LeadCreateView.as_view(), name="lead-create"),
]
