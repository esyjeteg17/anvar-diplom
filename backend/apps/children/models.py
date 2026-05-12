from django.db import models


class Child(models.Model):
    """Ребёнок-клиент школы.

    В одной модели объединены данные ребёнка и родителя — для дипломной
    школы этого достаточно, отдельную сущность Parent заводить не нужно.
    Если в будущем потребуется (например, для двух родителей у одного
    ребёнка), это вынесется отдельно без миграции данных.
    """

    # Данные ребёнка
    first_name = models.CharField("Имя ребёнка", max_length=80)
    last_name = models.CharField("Фамилия ребёнка", max_length=80)
    birth_date = models.DateField("Дата рождения", null=True, blank=True)

    # Контакты родителей
    parent_first_name = models.CharField("Имя родителя", max_length=80)
    parent_last_name = models.CharField("Фамилия родителя", max_length=80, blank=True, default="")
    parent_phone = models.CharField("Телефон родителя", max_length=32)
    parent_telegram = models.CharField("Telegram родителя", max_length=120, blank=True, default="")
    parent_vk = models.URLField("ВКонтакте родителя", blank=True, default="")

    # Привязка к центру и финансы
    center = models.ForeignKey(
        "centers.Center",
        on_delete=models.PROTECT,
        related_name="children",
        verbose_name="Центр",
    )
    monthly_fee = models.DecimalField(
        "Стоимость месяца",
        max_digits=8,
        decimal_places=2,
        default=0,
    )
    is_active = models.BooleanField("Занимается сейчас", default=True)
    notes = models.TextField("Комментарий", blank=True, default="")

    created_at = models.DateTimeField("Создан", auto_now_add=True)
    updated_at = models.DateTimeField("Обновлён", auto_now=True)

    class Meta:
        verbose_name = "Ребёнок"
        verbose_name_plural = "Дети"
        ordering = ("last_name", "first_name")

    @property
    def full_name(self) -> str:
        return f"{self.last_name} {self.first_name}".strip()

    @property
    def parent_full_name(self) -> str:
        return f"{self.parent_last_name} {self.parent_first_name}".strip()

    def __str__(self) -> str:
        return f"{self.full_name} ({self.center.name if self.center_id else '—'})"
