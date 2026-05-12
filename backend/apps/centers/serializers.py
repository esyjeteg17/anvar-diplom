from rest_framework import serializers

from .models import Center


class CenterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Center
        fields = ("id", "name", "address", "lat", "lng", "is_active", "created_at")
        read_only_fields = ("id", "created_at")
