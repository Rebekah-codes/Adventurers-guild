from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('guild_core.api_urls')),
    # Token auth endpoint (POST username & password) -> {"token": "..."}
    path('api-token-auth/', obtain_auth_token),
]
