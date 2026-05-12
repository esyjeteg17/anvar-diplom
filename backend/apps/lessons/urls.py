from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AttendanceViewSet, LessonViewSet

# Lessons монтируется на /api/lessons/, attendance — на /api/lessons/attendance/
# (оба роутера склеены ниже).
lessons_router = DefaultRouter()
lessons_router.register(r"", LessonViewSet, basename="lesson")

attendance_router = DefaultRouter()
attendance_router.register(r"", AttendanceViewSet, basename="attendance")

urlpatterns = [
    path("attendance/", include(attendance_router.urls)),
    path("", include(lessons_router.urls)),
]
