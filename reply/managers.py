from django.db import models


class ReplyManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(reply_post_status=True)
