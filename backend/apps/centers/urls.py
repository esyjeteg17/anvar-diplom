from rest_framework.routers import DefaultRouter

from .views import CenterViewSet

router = DefaultRouter()
router.register(r"", CenterViewSet, basename="center")

urlpatterns = router.urls
