from rest_framework import viewsets, permissions
from rest_framework.authentication import TokenAuthentication
from .models import Quest
from .serializers import QuestSerializer
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import SignupSerializer, GuildApplicationSerializer
from .models import GuildApplication


class QuestViewSet(viewsets.ModelViewSet):
    """A simple ViewSet for viewing and editing quests."""
    queryset = Quest.objects.order_by('-created_at')
    serializer_class = QuestSerializer
    # Allow read-only for unauthenticated users, require auth for writes
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    authentication_classes = [TokenAuthentication]


class SignupView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({'detail': 'User created. Await approval.'}, status=status.HTTP_201_CREATED)


class GuildApplicationViewSet(viewsets.ModelViewSet):
    queryset = GuildApplication.objects.order_by('-created_at')
    serializer_class = GuildApplicationSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        # If the user exists link, else leave user null
        serializer.save()
