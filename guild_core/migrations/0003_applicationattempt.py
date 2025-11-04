"""Create ApplicationAttempt model for honeypot tracking.

Generated manually.
"""
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('guild_core', '0002_guildapplication'),
    ]

    operations = [
        migrations.CreateModel(
            name='ApplicationAttempt',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ip', models.CharField(max_length=45, unique=True)),
                ('hits', models.IntegerField(default=0)),
                ('last_seen', models.DateTimeField(auto_now=True)),
                ('blocked_until', models.DateTimeField(blank=True, null=True)),
            ],
        ),
    ]
