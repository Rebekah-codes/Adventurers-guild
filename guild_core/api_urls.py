from rest_framework import routers
from . import api

router = routers.DefaultRouter()
router.register(r'quests', api.QuestViewSet, basename='quest')
router.register(r'applications', api.GuildApplicationViewSet, basename='application')

urlpatterns = router.urls

# Add signup endpoint
from django.urls import path
urlpatterns += [
	path('signup/', api.SignupView.as_view(), name='signup'),
]
