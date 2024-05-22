from django.urls import path

from oauth.views import OAuthLoginView

app_name = 'oauth'

urlpatterns = [
    path('login/', OAuthLoginView.as_view(), name='login')
]

