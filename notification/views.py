from django.db import transaction
from django.db.models import Q, Subquery, OuterRef
from django.shortcuts import render, redirect
from django.views import View
from rest_framework.response import Response
from rest_framework.views import APIView

from file.models import File
from notification.models import Notification, NotificationFile


class NotificationWriteView(View):
    def get(self, request):
        return render(request, 'notification/write.html')

    @transaction.atomic
    def post(self, request):
        data = request.POST
        file = request.FILES

        data = {
            'notification_title': data['notification-title'],
            'notification_content': data['notification-content'],
            'notification_status': data['notification-status']
        }

        notification = Notification.objects.create(**data)

        for key, file in request.FILES.items():
            file_instance = File.objects.create(file_size=file.size)
            NotificationFile.objects.create(file=file_instance, path=file, notification=notification)

        return redirect(notification.get_absolute_url())


class NotificationDetailView(View):
    def get(self, request):
        notification = Notification.objects.get(id=request.GET['id'])

        notification.notification_view_count += 1
        notification.save(update_fields=['notification_view_count'])

        context = {
            'notification' : notification,
            'notification_file' : list(notification.notificationfile_set.all())
        }

        return render(request, 'notification/detail.html', context)

class NotificationListView(View):
    def get(self, request):
        return render(request, 'notification/list.html')


class NotificationListAPI(APIView):
    def get(self, request, page):
        row_count=5

        offset = (page -1) *  row_count
        limit = page * row_count

        columns = [
            'id',
            'notification_title',
            'notification_content',
            'notification_view_count',
            'notification_status',
            'created_date',
            'notification_file'
        ]

        category = request.GET.get('category', 0)
        type = request.GET.get('type', '')
        keyword = request.GET.get('keyword', '')

        condition = Q()
        if type:
            for t in list(type):
                if t == 't':
                    condition |= Q(notification_title__icontains=keyword)

                elif t == 'c':
                    condition |= Q(notification_content__icontains=keyword)

                elif t =='tc':
                    condition |= Q(notification_title__icontains=keyword) & Q(notification_content__icontains=keyword)


        notifications = Notification.enabled_objects.filter(notification_status=category).filter(condition).annotate(
            notification_file=Subquery(NotificationFile.objects.filter(notification=OuterRef('pk')).values('path')[:1])
        ).values(*columns)[offset:limit]

        has_next = Notification.enabled_objects.filter().filter(condition)[limit:limit + 1].exists()

        notification_info = {
            'notifications' : notifications,
            'hasNext' : has_next
        }

        return Response(notification_info)


class NotificationUpdateView(View):
    def get(self, request, id):
        notification = Notification.objects.get(id=id)
        print(notification)
        context = {
            'notification' : notification,
            'notification_file' : notification.notificationfile_set.all()
        }
        return render(request, 'notification/update.html', context)

    @transaction.atomic
    def post(self, request, id):
        data = request.POST
        file = request.FILES
        print(id)

        notification = Notification.objects.get(id=id)
        notification.notification_title = data['notification-title']
        notification.notification_content = data['notification-content']
        notification.notification_status = data['notification-status']

        notification.save(update_fields=['notification_title', 'notification_content', 'notification_status'])

        notification.notificationfile_set.all().delete()

        for key, file in request.FILES.items():
            file_instance = File.objects.create(file_size=file.size)
            NotificationFile.objects.create(file=file_instance, path=file, notification=notification)

        return redirect(notification.get_absolute_url())