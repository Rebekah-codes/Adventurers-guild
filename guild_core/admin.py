from django.contrib import admin
from .models import GuildMember, Quest

@admin.register(GuildMember)
class GuildMemberAdmin(admin.ModelAdmin):
    list_display = ('user', 'race', 'class_type')
    search_fields = ('user__username', 'race', 'class_type')


@admin.register(Quest)
class QuestAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'location', 'posted_by', 'created_at')
    list_filter = ('status', 'location')
    search_fields = ('title', 'description')
