from rest_framework import viewsets, permissions
from .models import Quest
from .serializers import QuestSerializer


class QuestViewSet(viewsets.ModelViewSet):
    """A simple ViewSet for viewing and editing quests."""
    queryset = Quest.objects.order_by('-created_at')
    serializer_class = QuestSerializer
    permission_classes = [permissions.AllowAny]
