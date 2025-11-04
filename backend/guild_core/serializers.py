from rest_framework import serializers
from .models import Quest


class QuestSerializer(serializers.ModelSerializer):
    # Safely expose the username of the poster. posted_by is nullable, so use
    # a SerializerMethodField to avoid attribute errors when it's None.
    posted_by = serializers.SerializerMethodField()

    class Meta:
        model = Quest
        fields = ['id', 'title', 'location', 'reward', 'status', 'description', 'posted_by', 'created_at']
        read_only_fields = ['id', 'posted_by', 'created_at']

    def get_posted_by(self, obj):
        user = getattr(obj, 'posted_by', None)
        return user.username if user is not None else None


class SignupSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def create(self, validated_data):
        from django.contrib.auth.models import User
        user = User.objects.create_user(username=validated_data['username'], email=validated_data['email'], password=validated_data['password'])
        user.is_active = False
        user.save()
        return user


class GuildApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = __import__('guild_core.models', fromlist=['GuildApplication']).GuildApplication
        fields = ['id', 'email', 'full_name', 'skills', 'qualities', 'additional_info', 'status', 'created_at']
        read_only_fields = ['status', 'created_at']
