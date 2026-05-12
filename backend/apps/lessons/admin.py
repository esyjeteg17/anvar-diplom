from django.contrib import admin

from .models import Attendance, Lesson


class AttendanceInline(admin.TabularInline):
    """Посещения редактируются прямо на странице занятия."""

    model = Attendance
    extra = 0
    autocomplete_fields = ("child",)


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("date", "start_time", "center", "teacher", "topic", "conducted")
    list_filter = ("center", "conducted", "date")
    search_fields = ("topic", "description")
    list_editable = ("conducted",)
    autocomplete_fields = ("center", "teacher")
    date_hierarchy = "date"
    inlines = [AttendanceInline]


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ("lesson", "child", "present")
    list_filter = ("present", "lesson__center", "lesson__date")
    search_fields = ("child__last_name", "child__first_name", "comment")
    autocomplete_fields = ("lesson", "child")
