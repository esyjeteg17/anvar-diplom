from rest_framework import serializers

from .models import Child


class ChildSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)
    parent_full_name = serializers.CharField(read_only=True)
    # При выводе показываем имя центра, чтобы фронт не делал отдельный запрос.
    center_name = serializers.CharField(source="center.name", read_only=True)

    class Meta:
        model = Child
        fields = (
            "id",
            "first_name",
            "last_name",
            "full_name",
            "birth_date",
            "parent_first_name",
            "parent_last_name",
            "parent_full_name",
            "parent_phone",
            "parent_telegram",
            "parent_vk",
            "center",
            "center_name",
            "monthly_fee",
            "is_active",
            "notes",
            "created_at",
        )
        read_only_fields = ("id", "full_name", "parent_full_name", "center_name", "created_at")
