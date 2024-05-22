from django.db import models
from member.models import Member
from oneLabProject.models import Period
from share.models import Share
from university.models import University

class ShareMember(Period):
    SHARE_MEMBER_STATUS = [
        (0, '결제'),
        (1, '환불'),
    ]
    share_member_status = models.SmallIntegerField(choices=SHARE_MEMBER_STATUS, default=0)
    university = models.ForeignKey(University, on_delete=models.PROTECT)
    share = models.ForeignKey(Share, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_share_member'