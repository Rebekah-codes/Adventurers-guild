from rest_framework import viewsets, permissions
from rest_framework.authentication import TokenAuthentication
from .models import Quest
from .serializers import QuestSerializer


class QuestViewSet(viewsets.ModelViewSet):
    """A simple ViewSet for viewing and editing quests."""
    queryset = Quest.objects.order_by('-created_at')
    serializer_class = QuestSerializer
    # Allow read-only for unauthenticated users, require auth for writes
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    authentication_classes = [TokenAuthentication]
