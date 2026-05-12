from django.db import models


class Lead(models.Model):
    """Заявка с лендинга — заполненная форма обратной связи.

    Каждая запись — это попытка связаться со школой:
      - имя и телефон обязательны;
      - комментарий и источник перехода — опционально;
      - статус помогает менеджеру в админке отслеживать, обработана ли заявка.
    """

    class Status(models.TextChoices):
        NEW = "new", "Новая"
        IN_PROGRESS = "in_progress", "В работе"
        DONE = "done", "Обработана"
        REJECTED = "rejected", "Отклонена"

    name = models.CharField("Имя", max_length=120)
    phone = models.CharField("Телефон", max_length=32)
    message = models.TextField("Сообщение", blank=True, default="")
    # Откуда пришла заявка: "landing/form", "landing/quiz" и т.д.
    # Помогает понять, какие источники работают лучше.
    source = models.CharField("Источник", max_length=60, blank=True, default="landing/form")
    promo_code = models.CharField("Промокод", max_length=40, blank=True, default="")

    status = models.CharField(
        "Статус",
        max_length=20,
        choices=Status.choices,
        default=Status.NEW,
    )

    created_at = models.DateTimeField("Создана", auto_now_add=True)
    updated_at = models.DateTimeField("Обновлена", auto_now=True)

    class Meta:
        verbose_name = "Заявка"
        verbose_name_plural = "Заявки"
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return f"{self.name} ({self.phone}) — {self.get_status_display()}"
