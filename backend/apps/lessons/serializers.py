from rest_framework import serializers

from .models import Attendance, Lesson


class AttendanceSerializer(serializers.ModelSerializer):
    """Сериализатор посещения. Имя ребёнка отдаём ради читаемости фронта."""

    child_full_name = serializers.CharField(source="child.full_name", read_only=True)

    class Meta:
        model = Attendance
        fields = ("id", "lesson", "child", "child_full_name", "present", "comment")
        read_only_fields = ("id", "child_full_name")


class LessonSerializer(serializers.ModelSerializer):
    """Сериализатор занятия с встроенным списком посещений (read-only).
    Создание/обновление посещений — через отдельный AttendanceViewSet."""

    center_name = serializers.CharField(source="center.name", read_only=True)
    teacher_name = serializers.SerializerMethodField()
    attendances = AttendanceSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = (
            "id",
            "center", "center_name",
            "teacher", "teacher_name",
            "date", "start_time", "duration_min",
            "topic", "description", "conducted",
            "attendances",
            "created_at",
        )
        read_only_fields = ("id", "center_name", "teacher_name", "attendances", "created_at")

    def get_teacher_name(self, obj: Lesson) -> str:
        return obj.teacher.full_name if obj.teacher_id else ""
