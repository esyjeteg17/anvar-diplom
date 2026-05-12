from django.contrib import admin

from .models import Staff


@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ("last_name", "first_name", "role", "salary_per_month", "is_active", "hire_date")
    list_filter = ("role", "is_active")
    search_fields = ("last_name", "first_name", "phone", "email")
    list_editable = ("is_active",)
