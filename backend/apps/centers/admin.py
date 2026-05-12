from django.contrib import admin

from .models import Center


@admin.register(Center)
class CenterAdmin(admin.ModelAdmin):
    list_display = ("name", "address", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name", "address")
    list_editable = ("is_active",)
