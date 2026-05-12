from django.db import models


class Center(models.Model):
    """Партнёрский центр SBORIKA — место, где проходят занятия.

    Хранит адрес и координаты (lat/lng) для отображения на карте лендинга,
    привязка к центру есть у Child (где ребёнок занимается) и у Lesson
    (где проходит занятие).
    """

    name = models.CharField("Название", max_length=120)
    address = models.CharField("Адрес", max_length=255)
    lat = models.DecimalField("Широта", max_digits=9, decimal_places=6, null=True, blank=True)
    lng = models.DecimalField("Долгота", max_digits=9, decimal_places=6, null=True, blank=True)
    is_active = models.BooleanField("Активен", default=True)

    created_at = models.DateTimeField("Создан", auto_now_add=True)
    updated_at = models.DateTimeField("Обновлён", auto_now=True)

    class Meta:
        verbose_name = "Центр"
        verbose_name_plural = "Центры"
        ordering = ("name",)

    def __str__(self) -> str:
        return self.name
