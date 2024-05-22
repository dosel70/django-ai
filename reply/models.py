from django.db import models

from community.models import Community
from member.models import Member
from oneLabProject.models import Period
from reply.managers import ReplyManager


class Reply(Period):
    community = models.ForeignKey(Community, null=False, on_delete=models.PROTECT)
    member = models.ForeignKey(Member, null=False, on_delete=models.PROTECT)
    reply_content = models.TextField(null=False, blank=False)
    # True=게시 중, False=게시 종료
    reply_post_status = models.BooleanField(null=False, default=True)

    objects = models.Manager()
    enabled_objects = ReplyManager()

    class Meta:
        db_table = 'tbl_reply'
        ordering = ['-id']

    def __str__(self):
        return self.reply_content