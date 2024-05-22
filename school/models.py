from django.db import models
from member.models import Member
from oneLabProject.models import Period

class School(Period):
    school_member_address = models.CharField(max_length=500, null=False, blank=False, default='서울시 강남구')
    school_name = models.CharField(null=False, blank=False, max_length=100)
    member = models.ForeignKey(Member, primary_key=True, on_delete=models.PROTECT, null=False)
    # 신청 후 대기중 상태(0) / 관리자 승인 완료(1)
    school_member_status = models.BooleanField(null=False, blank=False, default=False)

    class Meta:
        db_table = 'tbl_school'
        ordering = ['-created_date']