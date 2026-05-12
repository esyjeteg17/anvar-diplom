from rest_framework import generics, permissions

from .models import Lead
from .serializers import LeadSerializer


class LeadCreateView(generics.CreateAPIView):
    """POST /api/leads/ — создание заявки с лендинга.

    Эндпоинт публичный — заявку может оставить любой посетитель.
    Чтение/изменение заявок — через админку, отдельный API не нужен.
    """

    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    permission_classes = [permissions.AllowAny]
