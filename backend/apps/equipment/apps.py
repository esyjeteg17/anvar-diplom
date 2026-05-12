from django.apps import AppConfig


class EquipmentConfig(AppConfig):
    """Учёт оборудования по центрам — наборы, планшеты, подставки."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.equipment"
    verbose_name = "Оборудование"
