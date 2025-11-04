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
