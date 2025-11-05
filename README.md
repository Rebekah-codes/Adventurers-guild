# Adventurers Guild — Django backend

This folder contains a minimal Django backend for the Adventurers Guild site.

Quick start (PowerShell):

1. Create and activate a virtual environment

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install dependencies

```powershell
pip install -r requirements.txt
```

3. Run migrations and create superuser

```powershell
python manage.py migrate
python manage.py createsuperuser
```

4. Run local server

```powershell
python manage.py runserver
```

Visit http://localhost:8000/admin to login to the Django admin and manage quests and members.

Deployment notes (Heroku):

- Use `heroku create --stack heroku-22` and set the buildpack to `heroku/python` (Heroku auto-detects normally).
- Set `DJANGO_SECRET_KEY` and other env vars via `heroku config:set`.
- Heroku will use `Procfile` to run gunicorn.
\nDeployed-forced-build: 2025-11-05T13:33:28.0707144+00:00
