from django.db import models

from file.models import File
from like.models import Like
from oneLabProject.models import Period

from onelab.managers import OnelabManager
from tag.models import Tag
from university.models import University


class OneLab(Period):
    onelab_main_title = models.TextField(blank=False, null=False)
    onelab_content = models.TextField(blank=False, null=False)
    onelab_detail_content = models.TextField(blank=False, null=False)
    onelab_url = models.CharField(blank=False, null=False, max_length=300, default='http://localhost:')
    onelab_max_count = models.SmallIntegerField(null=False, default=2, max_length=10)
    onelab_ask_email = models.CharField(null=False, max_length=300)
    # 활동중: True, 탈퇴: False
    onelab_status = models.BooleanField(null=False, default=True)
    university = models.ForeignKey(University, on_delete=models.PROTECT, null=False)
    tag = models.ForeignKey(Tag, on_delete=models.PROTECT, null=False)
    # True=게시 중, False=게시 종료
    onelab_post_status = models.BooleanField(null=False, default=True)


    objects = models.Manager()
    enabled_objects = OnelabManager()

    class Meta:
        db_table = 'tbl_onelab'
        ordering = ['-created_date']

    def get_absolute_url(self):
        return f'/onelab/detail?id={self.id}'

class OneLabFile(Period):
    file = models.ForeignKey(File, primary_key=True, on_delete=models.PROTECT, null=False)
    path = models.ImageField(null=False, blank=False, upload_to='onelab/%Y/%m/%d')
    onelab = models.ForeignKey(OneLab, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_onelab_file'

class OneLabBannerFile(Period):
    file = models.ForeignKey(File, primary_key=True, on_delete=models.PROTECT, null=False)
    path = models.ImageField(null=False, blank=False, upload_to='onelab_banner/%Y/%m/%d')
    onelab = models.ForeignKey(OneLab, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_onelab_banner_file'

class OneLabLike(Period):
    like = models.ForeignKey(Like, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_onelab_like'