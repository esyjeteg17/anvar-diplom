from rest_framework import serializers

from .models import Equipment


class EquipmentSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source="get_type_display", read_only=True)

    class Meta:
        model = Equipment
        fields = ("id", "type", "type_display", "quantity", "updated_at")
        read_only_fields = ("id", "type_display", "updated_at")
