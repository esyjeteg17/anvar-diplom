from django.contrib import admin

from .models import Child


@admin.register(Child)
class ChildAdmin(admin.ModelAdmin):
    list_display = (
        "last_name",
        "first_name",
        "center",
        "parent_last_name",
        "parent_phone",
        "monthly_fee",
        "is_active",
    )
    list_filter = ("center", "is_active")
    search_fields = (
        "last_name", "first_name",
        "parent_last_name", "parent_first_name", "parent_phone",
    )
    list_editable = ("is_active",)
    autocomplete_fields = ("center",)
