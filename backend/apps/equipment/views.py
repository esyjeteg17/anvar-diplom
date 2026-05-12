from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Equipment
from .serializers import EquipmentSerializer


class EquipmentViewSet(viewsets.ModelViewSet):
    """CRUD по счётчикам оборудования + action `adjust` для +1/−1.

    Список всегда содержит ровно 3 записи (по одной на тип). Если запись
    какого-то типа ещё не создана — `list` дозаполняет её на лету (с
    quantity=0), чтобы фронту было удобно.
    """

    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer

    def list(self, request, *args, **kwargs):
        """Возвращает все три типа — недостающие создаём с quantity=0."""
        for type_value, _label in Equipment.Type.choices:
            Equipment.objects.get_or_create(type=type_value)
        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=["post"], url_path="adjust")
    def adjust(self, request):
        """POST /api/equipment/adjust/  body: { "type": "set", "delta": 1 }

        Прибавляет/вычитает delta из quantity указанного типа.
        Quantity не уходит ниже нуля. Возвращает обновлённую запись.
        """
        eq_type = request.data.get("type")
        try:
            delta = int(request.data.get("delta", 0))
        except (TypeError, ValueError):
            return Response(
                {"detail": "delta должна быть целым числом"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        valid_types = {t for t, _ in Equipment.Type.choices}
        if eq_type not in valid_types:
            return Response(
                {"detail": f"Неизвестный тип: {eq_type}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        item, _ = Equipment.objects.get_or_create(type=eq_type)
        # Не уходим в минус — для счётчика отрицательное значение бессмысленно.
        item.quantity = max(0, item.quantity + delta)
        item.save()
        return Response(EquipmentSerializer(item).data)
