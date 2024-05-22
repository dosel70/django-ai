from django.db import transaction
from django.shortcuts import render, redirect
from django.views import View

from file.models import File
from member.models import Member
from place.models import PlaceReview, Place
from review.models import Review, ReviewFile
from share.models import Share, ShareReview


class ReviewPlaceWriteView(View):
    def get(self, request):
        place = Place.objects.get(id=request.GET['id'])
        return render(request, 'review/place-write.html',{'place': place})

    @transaction.atomic
    def post(self, request):
        data = request.POST
        place_id = data["place-id"]

        # input 태그 하나 당 파일 1개 일 떄
        file = request.FILES

        member = Member.objects.get(id=request.session['member']['id'])

        data = {
            'review_content': data['review-content'],
            'review_rating': data['review-rating'],
            'member': member,
        }
        review = Review.objects.create(**data)

        for key, file in file.items():
            file_instance = File.objects.create(file_size=file.size)
            ReviewFile.objects.create(review=review, file=file_instance, path=file)

        place = Place.objects.get(id=place_id)
        place_review_info = {
            'review': review,
            'place': place
        }
        PlaceReview.objects.create(**place_review_info)

        return redirect(f'/place/review/list?place_id={place_id}')

class ReviewShareWriteView(View):
    def get(self, request):
        share = Share.objects.get(id=request.GET['id'])
        return render(request, 'review/share-write.html',{'share': share})

    @transaction.atomic
    def post(self, request):
        data = request.POST
        share_id = data["share-id"]

        # input 태그 하나 당 파일 1개 일 떄
        file = request.FILES

        member = Member.objects.get(id=request.session['member']['id'])

        data = {
            'review_content': data['review-content'],
            'review_rating': data['review-rating'],
            'member': member,
        }
        review = Review.objects.create(**data)

        for key, file in file.items():
            file_instance = File.objects.create(file_size=file.size)
            ReviewFile.objects.create(review=review, file=file_instance, path=file)

        share = Share.objects.get(id=share_id)
        share_review_info = {
            'review': review,
            'share': share
        }
        ShareReview.objects.create(**share_review_info)

        return redirect(f'/share/review/list?share_id={share_id}')


