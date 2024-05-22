from django.urls import path

from member.views import MemberJoinView, MemberCheckIdView, MemberLoginView, SendVerificationCodeView, \
    MemberNormalJoinView, MemberIdSearchView, MemberResetPasswordView, MemberActivateEmailView, MemberMainView, \
    AdminMemberLoginView, AdminMainView, AdminMainUserView, AdminMainUserListAPI, AdminMainNotificationView, \
    AdminNotificationListAPI, AdminMainExhibitionView, AdminMainExhibitionListAPI, soft_delete, soft_delete_exhibition, \
    translate, AdminMainLogoutView

app_name = 'member'

urlpatterns = [
    path('join/', MemberJoinView.as_view(), name='join'),
    path('join-normal/', MemberNormalJoinView.as_view(), name='join-normal'),
    path('login/', MemberLoginView.as_view(), name='login'),
    path('check-id/', MemberCheckIdView.as_view(), name='check-id'),
    path('activate/<str:school>', SendVerificationCodeView.as_view(), name='activate'),
    path('account-find/', MemberIdSearchView.as_view(), name='account-find'),
    path('account-activate/<str:email>', MemberActivateEmailView.as_view(), name='account-activate'),
    path('account-reset/<int:id>/<str:random>/',MemberResetPasswordView.as_view(), name='account-reset'),
#     관리자 path 추가
    path('admin_login/', AdminMemberLoginView.as_view(), name='admin_login'),
    path('admin_main/', AdminMainView.as_view(), name='admin_main'),
    path('admin_main_user/', AdminMainUserView.as_view(), name='admin_main_user'),
    path('admin_main_user/<int:page>/', AdminMainUserListAPI.as_view(), name='admin_main_user_list'),
    path('admin_main_notification/', AdminMainNotificationView.as_view(), name='admin_main_notification'),
    path('admin_main_notification/<int:page>/', AdminNotificationListAPI.as_view(), name='admin_main_notification_list'),
    path('admin_main_exhibition/', AdminMainExhibitionView.as_view(), name='admin_main_exhibition'),
    path('admin_main_exhibition/<int:page>/', AdminMainExhibitionListAPI.as_view(), name='admin_main_exhibition_list'),
    path('soft_delete/', soft_delete, name='soft_delete'),
    path('soft_delete_exhibition/', soft_delete_exhibition, name='soft_delete_exhibition'),
    path('translate/', translate, name='translate'),
    path('admin_main_logout/', AdminMainLogoutView.as_view(), name='admin_logout')
]
