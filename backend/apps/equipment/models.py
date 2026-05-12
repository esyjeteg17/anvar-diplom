from django.db import models


class Equipment(models.Model):
    """Счётчик оборудования по типу: одна запись на каждый тип.

    Никаких центров и инвентарных номеров — просто «сколько всего
    наборов / планшетов / подставок» по школе. Уникальность по `type`
    гарантирует, что в БД ровно одна запись каждого типа.
    """

    class Type(models.TextChoices):
        SET = "set", "Наборы-конструкторы"
        TABLET = "tablet", "Планшеты"
        STAND = "stand", "Подставки"

    type = models.CharField("Тип", max_length=20, choices=Type.choices, unique=True)
    quantity = models.PositiveIntegerField("Количество", default=0)
    updated_at = models.DateTimeField("Обновлено", auto_now=True)

    class Meta:
        verbose_name = "Оборудование"
        verbose_name_plural = "Оборудование"
        ordering = ("type",)

    def __str__(self) -> str:
        return f"{self.get_type_display()}: {self.quantity}"
