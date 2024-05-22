from django.urls import path


from reply.views import ReplyWriteAPI, ReplyListAPI, ReplyAPI

app_name = 'replies'

urlpatterns = [
    path('write/', ReplyWriteAPI.as_view(), name='write'),
    path('list/<int:community_id>/<int:page>/', ReplyListAPI.as_view(), name='list'),
    path('<int:reply_id>/', ReplyAPI.as_view())
]
