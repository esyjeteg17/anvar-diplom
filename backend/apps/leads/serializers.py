from rest_framework import serializers

from .models import Lead


class LeadSerializer(serializers.ModelSerializer):
    """Сериализатор заявки. Поля status и обновления — только на чтение,
    клиент не должен их выставлять при отправке формы."""

    class Meta:
        model = Lead
        fields = (
            "id",
            "name",
            "phone",
            "message",
            "source",
            "promo_code",
            "status",
            "created_at",
        )
        read_only_fields = ("id", "status", "created_at")

    def validate_name(self, value: str) -> str:
        # Хотя бы одно непробельное имя — иначе сохранять бессмысленно.
        cleaned = value.strip()
        if len(cleaned) < 2:
            raise serializers.ValidationError("Слишком короткое имя")
        return cleaned

    def validate_phone(self, value: str) -> str:
        # Минимальная проверка: должно быть >= 10 цифр (российский номер
        # без префикса — 10 цифр; с +7 или 8 — 11). Маска снимается перед записью.
        digits = "".join(ch for ch in value if ch.isdigit())
        if len(digits) < 10:
            raise serializers.ValidationError("Неверный формат телефона")
        return value.strip()
