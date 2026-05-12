from rest_framework import viewsets

from .models import Attendance, Lesson
from .serializers import AttendanceSerializer, LessonSerializer


class LessonViewSet(viewsets.ModelViewSet):
    """CRUD по занятиям. Поддерживает фильтр ?center=ID и ?date_from / ?date_to,
    чтобы фронту-календарю не пришлось забирать всё разом."""

    serializer_class = LessonSerializer

    def get_queryset(self):
        qs = (
            Lesson.objects.select_related("center", "teacher")
            .prefetch_related("attendances", "attendances__child")
            .all()
        )
        params = self.request.query_params
        if (center_id := params.get("center")):
            qs = qs.filter(center_id=center_id)
        if (date_from := params.get("date_from")):
            qs = qs.filter(date__gte=date_from)
        if (date_to := params.get("date_to")):
            qs = qs.filter(date__lte=date_to)
        return qs


class AttendanceViewSet(viewsets.ModelViewSet):
    """CRUD по посещениям. Создаются для конкретного занятия и ребёнка
    (UniqueConstraint на (lesson, child) гарантирует, что повторов не будет)."""

    serializer_class = AttendanceSerializer

    def get_queryset(self):
        qs = Attendance.objects.select_related("child", "lesson").all()
        if (lesson_id := self.request.query_params.get("lesson")):
            qs = qs.filter(lesson_id=lesson_id)
        return qs
