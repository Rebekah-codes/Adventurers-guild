from rest_framework import routers
from . import api

router = routers.DefaultRouter()
router.register(r'quests', api.QuestViewSet, basename='quest')

urlpatterns = router.urls
