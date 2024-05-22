from datetime import date

from django.db import models
from django.utils.timezone import now

from file.models import File
from like.models import Like
from oneLabProject.models import Period
from place.managers import PlaceManager, PlaceReviewManager
from point.models import Point
from review.models import Review
from school.models import School


class Place(Period):

    place_title = models.TextField(null=False, blank=False)
    place_content = models.TextField(null=False, blank=False)
    place_points = models.BigIntegerField(null=True, default=1000)
    # False=결제 전, True=결제완료
    place_order_status = models.BooleanField(null=False, default=False)
    place_review_rating = models.FloatField(null=False, default=0.0)
    place_image_file = models.ImageField(null=False, blank=False, upload_to='')
    school = models.ForeignKey(School, on_delete=models.PROTECT, null=False)
    place_date = models.DateField(null=False, blank=False, default=now)
    place_ask_email = models.CharField(null=False, max_length=300)
    place_url = models.CharField(null=False, max_length=300, default='http://localhost:')
    place_post_status = models.BooleanField(default=True, null=False)

    objects = models.Manager()
    enabled_objects = PlaceManager()

    class Meta:
        db_table = 'tbl_place'
        ordering = ['-id']

    def get_absolute_url(self):
        return f'/place/detail/?id={self.id}'

class PlaceFile(Period):
    file = models.ForeignKey(File, primary_key=True, on_delete=models.PROTECT, null=False)
    path = models.ImageField(null=False, blank=False, upload_to='place/%Y/%m/%d')
    place = models.ForeignKey(Place, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_place_file'

class PlaceLike(Period):
    like = models.ForeignKey(Like, primary_key=True, on_delete=models.PROTECT, null=False)
    place = models.ForeignKey(Place, on_delete=models.PROTECT, null=False, default=1)

    class Meta:
        db_table = 'tbl_place_like'

class PlacePoints(Period):
    points = models.ForeignKey(Point, primary_key=True, on_delete=models.PROTECT, null=False)
    place = models.ForeignKey(Place, on_delete=models.PROTECT, null=False)

    class Meta:
        db_table = 'tbl_place_points'

class PlaceReview(Period):
    review = models.ForeignKey(Review, primary_key=True, on_delete=models.PROTECT, null=False)
    place = models.ForeignKey(Place, on_delete=models.PROTECT, null=False)

    objects = models.Manager()
    enabled_objects = PlaceReviewManager()
    class Meta:
        db_table = 'tbl_place_review'
