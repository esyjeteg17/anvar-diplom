from django.apps import AppConfig


class LeadsConfig(AppConfig):
    """Конфигурация приложения «Заявки» (формы обратной связи с лендинга)."""

    default_auto_field = "django.db.models.BigAutoField"
    # Полный путь — приложение лежит в каталоге apps/leads и регистрируется
    # как apps.leads, а не просто leads (см. INSTALLED_APPS).
    name = "apps.leads"
    verbose_name = "Заявки"
