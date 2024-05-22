from django.db import models

from file.models import File
from oneLabProject.models import Period
from tag.models import Tag


class Member(Period):
    # 일반 이메일
    member_email = models.CharField(blank=False, null=False, max_length=50)
    # 학교 이메일
    member_school_email = models.CharField(blank=False, null=False, max_length=50, default="<EMAIL>")
    member_password = models.CharField(blank=False, null=False, max_length=20)
    member_name = models.CharField(blank=False, null=False, max_length=100)
    member_phone = models.CharField(null=False, blank=False, max_length=30)
    # 일반 회원: True, 관리자: False
    member_status = models.BooleanField(null=False, default=True)
    member_type = models.TextField(blank=False, default="oneLabProject")
    tag = models.ForeignKey(Tag, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_member'

class MemberFile(Period):
    file = models.ForeignKey(File, primary_key=True, on_delete=models.PROTECT, null=False)
    path = models.ImageField(null=False, blank=False, upload_to='member/%Y/%m/%d')
    member = models.ForeignKey(Member, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_member_file'