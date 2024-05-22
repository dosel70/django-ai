from django.db import models


class NotificationManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(notification_post_status=True)
