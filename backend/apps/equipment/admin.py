from django.contrib import admin

from .models import Equipment


@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ("type", "quantity", "updated_at")
    list_editable = ("quantity",)
    list_filter = ("type",)
