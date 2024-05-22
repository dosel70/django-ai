from django.urls import path

from school.views import SchoolMainView, SchoolMemberView

app_name = 'school'

urlpatterns = [
    path('main/', SchoolMainView.as_view(), name='main'),
    path('member/', SchoolMemberView.as_view(), name='member')
]

