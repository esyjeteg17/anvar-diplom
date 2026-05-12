from django.db import models


class Expense(models.Model):
    """Расход компании. Категория помогает агрегировать в отчётах,
    дата нужна для разбивки по месяцам, сумма всегда положительная."""

    class Category(models.TextChoices):
        TRANSPORT = "transport", "Транспорт"
        RENT = "rent", "Аренда"
        EQUIPMENT = "equipment", "Оборудование / конструкторы"
        MARKETING = "marketing", "Реклама"
        SUPPLIES = "supplies", "Расходники"
        OTHER = "other", "Прочее"

    date = models.DateField("Дата")
    category = models.CharField(
        "Категория",
        max_length=20,
        choices=Category.choices,
        default=Category.OTHER,
    )
    amount = models.DecimalField("Сумма", max_digits=10, decimal_places=2)
    description = models.CharField("Описание", max_length=255, blank=True, default="")

    created_at = models.DateTimeField("Создан", auto_now_add=True)
    updated_at = models.DateTimeField("Обновлён", auto_now=True)

    class Meta:
        verbose_name = "Расход"
        verbose_name_plural = "Расходы"
        ordering = ("-date",)
        indexes = [models.Index(fields=["date", "category"])]

    def __str__(self) -> str:
        return f"{self.date} — {self.get_category_display()} — {self.amount}"
