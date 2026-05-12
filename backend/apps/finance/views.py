from datetime import date

from django.db.models import Sum
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.children.models import Child
from apps.staff.models import Staff

from .models import Expense
from .serializers import ExpenseSerializer


class ExpenseViewSet(viewsets.ModelViewSet):
    """CRUD по расходам + сводка `summary` для дашборда финансов."""

    serializer_class = ExpenseSerializer

    def get_queryset(self):
        qs = Expense.objects.all()
        params = self.request.query_params
        if (date_from := params.get("date_from")):
            qs = qs.filter(date__gte=date_from)
        if (date_to := params.get("date_to")):
            qs = qs.filter(date__lte=date_to)
        if (category := params.get("category")):
            qs = qs.filter(category=category)
        return qs

    @action(detail=False, methods=["get"], url_path="summary")
    def summary(self, request):
        """Сводный отчёт по компании на основании моделей Child/Staff/Expense.

        Доход = сумма monthly_fee всех активных детей (один месяц).
        Зарплаты = сумма salary_per_month всех активных сотрудников.
        Расходы = сумма всех расходов за указанный период (по умолчанию — текущий месяц).
        Прибыль = Доход − Зарплаты − Расходы.
        """

        today = date.today()
        period_from = request.query_params.get("date_from", today.replace(day=1).isoformat())
        period_to = request.query_params.get("date_to", today.isoformat())

        income = (
            Child.objects.filter(is_active=True)
            .aggregate(total=Sum("monthly_fee"))["total"] or 0
        )
        salaries = (
            Staff.objects.filter(is_active=True)
            .aggregate(total=Sum("salary_per_month"))["total"] or 0
        )
        expenses_qs = Expense.objects.filter(date__gte=period_from, date__lte=period_to)
        expenses_total = expenses_qs.aggregate(total=Sum("amount"))["total"] or 0
        # Разбивка расходов по категориям — для столбчатых графиков на фронте.
        by_category = {
            row["category"]: row["total"]
            for row in expenses_qs.values("category").annotate(total=Sum("amount"))
        }

        profit = float(income) - float(salaries) - float(expenses_total)

        return Response({
            "period_from": period_from,
            "period_to": period_to,
            "income": float(income),
            "salaries": float(salaries),
            "expenses": float(expenses_total),
            "expenses_by_category": {k: float(v) for k, v in by_category.items()},
            "profit": profit,
            "active_children_count": Child.objects.filter(is_active=True).count(),
            "active_staff_count": Staff.objects.filter(is_active=True).count(),
        })
