from django.contrib import admin
from .models import GuildMember, Quest


from .models import GuildApplication


@admin.action(description='Approve selected applications')
def approve_applications(modeladmin, request, queryset):
    for app in queryset:
        app.approve(admin_user=request.user)


class GuildApplicationAdmin(admin.ModelAdmin):
    list_display = ('email', 'full_name', 'status', 'created_at')
    actions = [approve_applications]


admin.site.register(GuildApplication, GuildApplicationAdmin)

@admin.register(GuildMember)
class GuildMemberAdmin(admin.ModelAdmin):
    list_display = ('user', 'race', 'class_type')
    search_fields = ('user__username', 'race', 'class_type')


@admin.register(Quest)
class QuestAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'location', 'posted_by', 'created_at')
    list_filter = ('status', 'location')
    search_fields = ('title', 'description')
