from django.db import models

from member.models import Member
from oneLabProject.models import Period
from onelab.models import OneLab


class Alarm(Period):
    ALARM_STATUS = [
        (0, '승인'),
        (1, '거절'),
        (-1, '탈퇴'),
        (2, '대기')
    ]

    alarm_status = models.SmallIntegerField(choices=ALARM_STATUS, default=2)
    alarm_message = models.CharField(null=False, blank=False, max_length=100)
    alarm_receiver = models.CharField(null=False, blank=False, max_length=100)
    alarm_sender = models.CharField(null=False, blank=False, max_length=100)
    member = models.ForeignKey(Member, on_delete=models.PROTECT, null=False)
    onelab = models.ForeignKey(OneLab, on_delete=models.PROTECT, null=False)
    # 알람 표기를 위한 상태값
    status = models.BooleanField(default=1, null=False, blank=False)

    class Meta:
        db_table = 'tbl_alarm'
        ordering = ['-id']