from django.contrib import admin

from .models import Lead


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    """Админка заявок: список с фильтрами по статусу и источнику,
    поиск по имени/телефону, быстрая правка статуса прямо из таблицы."""

    list_display = ("name", "phone", "status", "source", "promo_code", "created_at")
    list_filter = ("status", "source", "created_at")
    list_editable = ("status",)
    search_fields = ("name", "phone", "message")
    readonly_fields = ("created_at", "updated_at")
    ordering = ("-created_at",)

    fieldsets = (
        ("Контакт", {"fields": ("name", "phone", "message")}),
        ("Метаданные", {"fields": ("source", "promo_code", "status")}),
        ("Время", {"fields": ("created_at", "updated_at")}),
    )
