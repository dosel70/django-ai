from django.db import models

from exhibition.managers import ExhibitionManager
from file.models import File
from like.models import Like
from oneLabProject.models import Period
from school.models import School


class Exhibition(Period):
    exhibition_title = models.TextField(null=False, blank=False)
    exhibition_content = models.TextField(null=False, blank=False)
    # False=관리자, True=school
    exhibition_status = models.BooleanField(null=False, blank=False, default=True)
    school = models.ForeignKey(School, on_delete=models.PROTECT)
    # True=게시 중, False=게시 종료
    exhibition_post_status = models.BooleanField(null=False, default=True)
    exhibition_url = models.TextField(null=False, blank=False)
    exhibition_view_count = models.IntegerField(null=False, blank=False, default=0)
    objects = models.Manager()
    enabled_objects = ExhibitionManager()

    class Meta:
        db_table = 'tbl_exhibition'
        ordering = ['-id']

    def get_absolute_url(self):
        return f'/exhibition/detail/?id={self.id}'

class ExhibitionFile(Period):
    file = models.ForeignKey(File, primary_key=True, on_delete=models.PROTECT, null=False)
    path = models.ImageField(null=False, blank=False, upload_to='exhibition/%Y/%m/%d')
    exhibition = models.ForeignKey(Exhibition, on_delete=models.PROTECT, null=False)
    download_path = models.ImageField(null=False, blank=False, upload_to='exhibition_down/%Y/%m/%d')
    preview = models.BooleanField(default=False)

    class Meta:
        db_table = 'tbl_exhibition_file'

class ExhibitionLike(Period):
    like = models.ForeignKey(Like, primary_key=True, on_delete=models.PROTECT, null=False)
    class Meta:
        db_table = 'tbl_exhibition_like'