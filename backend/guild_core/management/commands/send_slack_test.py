from django.core.management.base import BaseCommand
import os
import json
import urllib.request


class Command(BaseCommand):
    help = 'Send a test Slack notification using SLACK_WEBHOOK_URL env var'

    def handle(self, *args, **options):
        webhook = os.environ.get('SLACK_WEBHOOK_URL')
        if not webhook:
            self.stderr.write('SLACK_WEBHOOK_URL not set')
            return
        payload = {'text': '[Adventurers Guild] Test notification from backend (management command)'}
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(webhook, data=data, headers={'Content-Type': 'application/json'})
        try:
            resp = urllib.request.urlopen(req, timeout=10)
            code = getattr(resp, 'getcode', lambda: None)()
            self.stdout.write(f'status {code}')
        except Exception as e:
            self.stderr.write('Error sending Slack notification: ' + str(e))
