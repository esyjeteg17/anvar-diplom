from rest_framework import viewsets

from .models import Center
from .serializers import CenterSerializer


class CenterViewSet(viewsets.ModelViewSet):
    """CRUD по центрам. Глобальный IsAuthenticatedOrReadOnly из settings —
    список доступен всем, изменять — только авторизованным."""

    queryset = Center.objects.all()
    serializer_class = CenterSerializer
