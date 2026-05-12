from django.db import models


class Lesson(models.Model):
    """Одно занятие в расписании. Привязано к центру, к преподавателю,
    имеет дату/время, тему и флаг «проведено». Через отдельную модель
    Attendance связано с детьми (M2M через through-таблицу с комментарием)."""

    center = models.ForeignKey(
        "centers.Center",
        on_delete=models.PROTECT,
        related_name="lessons",
        verbose_name="Центр",
    )
    teacher = models.ForeignKey(
        "staff.Staff",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="lessons",
        verbose_name="Преподаватель",
    )

    date = models.DateField("Дата")
    start_time = models.TimeField("Начало")
    duration_min = models.PositiveIntegerField("Длительность, мин", default=60)

    topic = models.CharField("Тема занятия", max_length=255, blank=True, default="")
    description = models.TextField("Описание / план", blank=True, default="")
    conducted = models.BooleanField("Проведено", default=False)

    children = models.ManyToManyField(
        "children.Child",
        through="Attendance",
        related_name="lessons",
        verbose_name="Дети на занятии",
    )

    created_at = models.DateTimeField("Создано", auto_now_add=True)
    updated_at = models.DateTimeField("Обновлено", auto_now=True)

    class Meta:
        verbose_name = "Занятие"
        verbose_name_plural = "Занятия"
        ordering = ("-date", "-start_time")
        indexes = [
            models.Index(fields=["center", "date"]),
            models.Index(fields=["date"]),
        ]

    def __str__(self) -> str:
        topic = self.topic or "(без темы)"
        return f"{self.date} {self.start_time} — {self.center.name} — {topic}"


class Attendance(models.Model):
    """Запись о присутствии ребёнка на конкретном занятии.
    Хранит флаг «был» и индивидуальный комментарий преподавателя."""

    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name="attendances",
        verbose_name="Занятие",
    )
    child = models.ForeignKey(
        "children.Child",
        on_delete=models.CASCADE,
        related_name="attendances",
        verbose_name="Ребёнок",
    )
    present = models.BooleanField("Присутствовал", default=False)
    comment = models.TextField("Комментарий", blank=True, default="")

    created_at = models.DateTimeField("Создано", auto_now_add=True)
    updated_at = models.DateTimeField("Обновлено", auto_now=True)

    class Meta:
        verbose_name = "Посещение"
        verbose_name_plural = "Посещения"
        # Один ребёнок не может быть на одном занятии дважды.
        constraints = [
            models.UniqueConstraint(fields=["lesson", "child"], name="uniq_attendance_lesson_child"),
        ]
        ordering = ("lesson__date", "child__last_name")

    def __str__(self) -> str:
        mark = "был" if self.present else "не был"
        return f"{self.child} — {self.lesson.date} ({mark})"
