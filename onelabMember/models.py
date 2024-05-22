from django.db import models
from oneLabProject.models import Period
from onelab.models import OneLab

from university.models import University


class OneLabMember(Period):
    ONELAB_MEMBER_STATUS = [
        (0, '대기중'),
        (1, '참가'),
        (2, '거절'),
        (3, '탈퇴')
    ]
    onelab_member_status = models.SmallIntegerField(choices=ONELAB_MEMBER_STATUS, default=0)
    university = models.ForeignKey(University, on_delete=models.PROTECT)
    onelab = models.ForeignKey(OneLab, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_onelab_member'
