import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'dev-secret-key')

DEBUG = os.environ.get('DJANGO_DEBUG', '1') == '1'

ALLOWED_HOSTS = os.environ.get('DJANGO_ALLOWED_HOSTS', '*').split(',')

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'guild_core',
    'rest_framework',
    'rest_framework.authtoken',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'asharavel_guild.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'asharavel_guild.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Allow DATABASE_URL override (Heroku)
try:
    import dj_database_url
    DATABASES['default'] = dj_database_url.config(conn_max_age=600, ssl_require=False) or DATABASES['default']
except Exception:
    pass

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static']

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
}

# Throttling: limit application submissions to prevent spam. The
# specific rate for the 'application' scope is configured here.
REST_FRAMEWORK.setdefault('DEFAULT_THROTTLE_CLASSES', [
    'rest_framework.throttling.AnonRateThrottle',
])
REST_FRAMEWORK.setdefault('DEFAULT_THROTTLE_RATES', {
    'anon': '100/day',
    'application': '10/hour',
})

# Email settings: use console backend by default for local dev. In production,
# set DJANGO_EMAIL_BACKEND and relevant SMTP env vars (EMAIL_HOST, EMAIL_PORT, etc.).
EMAIL_BACKEND = os.environ.get('DJANGO_EMAIL_BACKEND', 'django.core.mail.backends.console.EmailBackend')
DEFAULT_FROM_EMAIL = os.environ.get('DJANGO_DEFAULT_FROM_EMAIL', 'no-reply@adventurers-guild.example')

# Admins to notify about new applications (comma-separated)
ADMINS = []
if os.environ.get('DJANGO_ADMIN_EMAILS'):
    ADMINS = [(a, a) for a in os.environ.get('DJANGO_ADMIN_EMAILS').split(',')]

# Spam protection defaults (used by server-side persistent attempt tracking)
SPAM_SHORT_WINDOW_HOURS = int(os.environ.get('SPAM_SHORT_WINDOW_HOURS', '1'))
SPAM_SHORT_LIMIT = int(os.environ.get('SPAM_SHORT_LIMIT', '5'))
SPAM_COOLDOWN_MINUTES = int(os.environ.get('SPAM_COOLDOWN_MINUTES', '30'))
SPAM_PERMANENT_LIMIT = int(os.environ.get('SPAM_PERMANENT_LIMIT', '100'))

