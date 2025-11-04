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

# Extra API endpoints
urlpatterns += [
	path('me/', api.MeView.as_view(), name='me'),
	path('password-reset/', api.PasswordResetRequestView.as_view(), name='password_reset'),
	path('password-reset-confirm/', api.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('applications/<int:pk>/approve/', api.ApplicationApproveView.as_view(), name='application_approve'),
    path('applications/<int:pk>/reject/', api.ApplicationRejectView.as_view(), name='application_reject'),
    path('debug/application-attempt/', api.DebugApplicationAttemptView.as_view(), name='debug_application_attempt'),
]
