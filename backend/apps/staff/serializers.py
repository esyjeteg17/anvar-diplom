from rest_framework import serializers

from .models import Staff


class StaffSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = Staff
        fields = (
            "id",
            "first_name",
            "last_name",
            "full_name",
            "role",
            "phone",
            "email",
            "salary_per_month",
            "hire_date",
            "is_active",
        )
        read_only_fields = ("id", "full_name")
