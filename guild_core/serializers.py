from rest_framework import serializers
from .models import Quest

class QuestSerializer(serializers.ModelSerializer):
    posted_by = serializers.CharField(source='posted_by.username', read_only=True)

    class Meta:
        model = Quest
        fields = ['id', 'title', 'location', 'reward', 'status', 'description', 'posted_by', 'created_at']
        read_only_fields = ['id', 'posted_by', 'created_at']
