from django.apps import AppConfig


class StaffConfig(AppConfig):
    """Сотрудники SBORIKA — преподаватели и менеджеры с месячной зарплатой."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.staff"
    verbose_name = "Сотрудники"
