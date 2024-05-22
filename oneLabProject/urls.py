from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

from exhibition.views import ExhibitionFileDownloadView
from oneLabProject.views import MainView
from share.views import ShareDownloadView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('member/', include('member.urls')),
    path('accounts/', include('allauth.urls')),
    path('oauth/', include('oauth.urls')),
    path('onelab/', include('onelab.urls')),
    path('community/', include('community.urls')),
    path('myPage/', include('myPage.urls')),
    path('point/', include('point.urls')),
    path('alarm/', include('alarm.urls')),
    path('replies/', include('reply.urls')),
    path('place/', include('place.urls')),
    path('school/', include('school.urls')),
    path('review/', include('review.urls')),
    path('share/', include('share.urls')),
    path('upload/<path:file_path>', ShareDownloadView.as_view(), name='download'),
    path('exhibition/', include('exhibition.urls')),
    path('upload/<path:file_path>/', ExhibitionFileDownloadView.as_view(), name='exhibition-down'),
    path('notification/', include('notification.urls')),
    path('', MainView.as_view(), name='main'),
    path('ai/api/', include('ai.urls')),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
