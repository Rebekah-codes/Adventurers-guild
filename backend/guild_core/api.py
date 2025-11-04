from rest_framework import viewsets, permissions
from rest_framework.authentication import TokenAuthentication
from .models import Quest
from .serializers import QuestSerializer
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import SignupSerializer, GuildApplicationSerializer
from .models import GuildApplication
from django.core.mail import mail_admins
from django.conf import settings
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.template.loader import render_to_string



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
        app = serializer.save()
        # Notify admins via email
        try:
            subject = f"New guild application: {app.email}"
            message = f"A new application was submitted by {app.full_name or app.email}.\n\nSkills:\n{app.skills}\n\nQualities:\n{app.qualities}\n\nAdditional info:\n{app.additional_info}\n\nReview it in the admin: /admin/guild_core/guildapplication/{app.id}/change/"
            # mail_admins will use ADMINS from settings
            mail_admins(subject, message, fail_silently=True)
        except Exception:
            # Don't fail the request if email fails
            pass


class MeView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        user = request.user if request.user and request.user.is_authenticated else None
        data = {'is_authenticated': bool(user), 'username': user.username if user else None, 'is_member': False}
        if user:
            # check guild member
            try:
                from .models import GuildMember
                data['is_member'] = hasattr(user, 'guildmember')
            except Exception:
                data['is_member'] = False
        return Response(data)


class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'detail': 'Email required'}, status=status.HTTP_400_BAD_REQUEST)
        users = User.objects.filter(email__iexact=email)
        if not users.exists():
            # For security, don't reveal whether email exists
            return Response({'detail': 'If that email exists, a reset link has been sent.'})
        for user in users:
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            # Build a reset link; front-end can have a password set page to consume uid & token
            reset_link = request.build_absolute_uri(f"/set-password?uid={uid}&token={token}")
            subject = 'Password reset for Adventurers Guild'
            message = render_to_string('emails/password_reset.txt', {'reset_link': reset_link, 'user': user})
            try:
                user.email_user(subject, message, from_email=settings.DEFAULT_FROM_EMAIL)
            except Exception:
                pass
        return Response({'detail': 'If that email exists, a reset link has been sent.'})


class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        if not uid or not token or not new_password:
            return Response({'detail': 'uid, token and new_password are required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            uid_decoded = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=uid_decoded)
        except Exception:
            return Response({'detail': 'Invalid uid'}, status=status.HTTP_400_BAD_REQUEST)
        if not default_token_generator.check_token(user, token):
            return Response({'detail': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
        user.save()
        return Response({'detail': 'Password set successfully.'})
