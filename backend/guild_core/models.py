from django.db import models
from django.contrib.auth.models import User

class GuildMember(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    race = models.CharField(max_length=50, blank=True)
    class_type = models.CharField(max_length=50, blank=True)
    achievements = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.username} ({self.race} {self.class_type})"

class Quest(models.Model):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Completed', 'Completed'),
    ]

    title = models.CharField(max_length=200)
    location = models.CharField(max_length=100, blank=True)
    reward = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    description = models.TextField(blank=True)
    posted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} [{self.status}]"


class GuildApplication(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    user = models.OneToOneField('auth.User', on_delete=models.CASCADE, null=True, blank=True)
    email = models.EmailField()
    full_name = models.CharField(max_length=200, blank=True)
    skills = models.TextField(blank=True)
    qualities = models.TextField(blank=True)
    additional_info = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Application {self.email} ({self.status})"

    def approve(self, admin_user=None):
        # Activate linked user if present, otherwise create a user
        from django.contrib.auth.models import User
        if not self.user:
            # Create a user with unusable password; admin should set password/reset
            username_base = self.email.split('@')[0]
            username = username_base
            i = 1
            while User.objects.filter(username=username).exists():
                username = f"{username_base}{i}"
                i += 1
            user = User.objects.create(username=username, email=self.email, is_active=True)
            user.set_unusable_password()
            user.save()
            self.user = user
        else:
            self.user.is_active = True
            self.user.save()

        # Create GuildMember record if not present
        from .models import GuildMember
        if not hasattr(self.user, 'guildmember'):
            GuildMember.objects.create(user=self.user)

        self.status = 'approved'
        self.save()


class ApplicationAttempt(models.Model):
    """Track application attempts by IP to implement persistent honeypot cooldowning.

    This model is the single source of truth for persistent anti-spam tracking. It
    stores a unique IP, a running hit count, the last-seen timestamp and an
    optional `blocked_until` datetime which, if set to a future time, indicates
    the IP is currently blocked.
    """
    ip = models.CharField(max_length=45, unique=True)
    hits = models.IntegerField(default=0)
    last_seen = models.DateTimeField(auto_now=True)
    blocked_until = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Attempt {self.ip}: {self.hits} hits"
