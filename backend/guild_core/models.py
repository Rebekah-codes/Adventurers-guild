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
