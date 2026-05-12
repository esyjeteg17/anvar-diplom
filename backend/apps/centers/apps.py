from django.apps import AppConfig


class CentersConfig(AppConfig):
    """Партнёрские центры SBORIKA — справочник адресов с координатами."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.centers"
    verbose_name = "Центры"
