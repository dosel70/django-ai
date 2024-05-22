from django.db import models
from exhibition.models import Exhibition
from member.models import Member
from oneLabProject.models import Period
from university.models import University

class ExhibitionMember(Period):
    EXHIBITION_MEMBER_STATUS = [
        (0, '참가'),
        (1, '종료'),
    ]
    exhibition_member_status = models.SmallIntegerField(choices=EXHIBITION_MEMBER_STATUS, default=0)
    university = models.ForeignKey(University, on_delete=models.PROTECT)
    exhibition = models.ForeignKey(Exhibition, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_exhibition_member'