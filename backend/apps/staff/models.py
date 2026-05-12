from django.db import models


class Staff(models.Model):
    """Сотрудник школы (преподаватель, менеджер и т.д.) с месячной зарплатой.

    Сумма salary_per_month учитывается в финансовом отчёте за каждый месяц,
    в котором сотрудник числится активным.
    """

    class Role(models.TextChoices):
        TEACHER = "teacher", "Преподаватель"
        MANAGER = "manager", "Менеджер"
        ADMIN = "admin", "Администратор"
        OTHER = "other", "Другое"

    first_name = models.CharField("Имя", max_length=80)
    last_name = models.CharField("Фамилия", max_length=80)
    role = models.CharField("Роль", max_length=20, choices=Role.choices, default=Role.TEACHER)
    phone = models.CharField("Телефон", max_length=32, blank=True, default="")
    email = models.EmailField("Email", blank=True, default="")
    salary_per_month = models.DecimalField(
        "Зарплата в месяц",
        max_digits=10,
        decimal_places=2,
        default=0,
    )
    hire_date = models.DateField("Дата найма", null=True, blank=True)
    is_active = models.BooleanField("Работает сейчас", default=True)

    created_at = models.DateTimeField("Создан", auto_now_add=True)
    updated_at = models.DateTimeField("Обновлён", auto_now=True)

    class Meta:
        verbose_name = "Сотрудник"
        verbose_name_plural = "Сотрудники"
        ordering = ("last_name", "first_name")

    @property
    def full_name(self) -> str:
        return f"{self.last_name} {self.first_name}".strip()

    def __str__(self) -> str:
        return f"{self.full_name} ({self.get_role_display()})"
