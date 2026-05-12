from django.apps import AppConfig


class FinanceConfig(AppConfig):
    """Финансы — расходы (транспорт, аренда и т.д.).
    Доход и зарплаты считаются производными от Child.monthly_fee и
    Staff.salary_per_month соответственно — отдельно их не храним."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.finance"
    verbose_name = "Финансы"
