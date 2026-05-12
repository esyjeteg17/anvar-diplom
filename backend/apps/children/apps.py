from django.apps import AppConfig


class ChildrenConfig(AppConfig):
    """Дети — клиенты школы. Хранит ребёнка вместе с контактами родителей."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.children"
    verbose_name = "Дети"
