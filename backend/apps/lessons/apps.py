from django.apps import AppConfig


class LessonsConfig(AppConfig):
    """Расписание занятий + посещаемость детей."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.lessons"
    verbose_name = "Занятия"
