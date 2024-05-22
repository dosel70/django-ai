import math
from decimal import Decimal

from django.core.paginator import Paginator
from django.db import transaction
from django.db.models import Avg, F, Q, Sum
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views import View
from django.urls import reverse
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
import json
from rest_framework.views import APIView

from community.models import Community
from file.models import File
from like.models import Like
from member.models import Member, MemberFile
from onelab.models import OneLab
from place.models import PlaceReview, PlaceLike, PlacePoints
from place.models import Place, PlaceFile
from placeMember.models import PlaceMember
from point.models import Point
from review.models import Review
from school.models import School
from share.models import Share
from oneLabProject.settings import MEDIA_URL
from university.models import University


class PlaceDetailView(View):
    def get(self, request, id):
        post = Place.objects.get(id=id)

        school_member = School.objects.get(member=post.school)
        post_list = Place.enabled_objects.filter(school=school_member).order_by('-id')
        page = request.GET.get('page', 1)
        paginator = Paginator(post_list, 4)
        posts = paginator.page(page)

        # 이미지 파일 가져오기
        for p in posts:
            first_file = p.placefile_set.first()
            if first_file:
                # 파일이 있으면 파일의 경로를 기반으로 URL 생성
                p.image_url = f"{MEDIA_URL}{first_file.path}"
            else:
                p.image_url = None

        # 리뷰 평균과 개수
        reviews = PlaceReview.enabled_objects.filter(place_id=post.id)
        if len(reviews) > 0:
            review_count = reviews.count()
            review_avg_decimal = reviews.aggregate(avg_rating=Avg('review__review_rating'))['avg_rating']
            review_avg_rounded = Decimal(review_avg_decimal).quantize(Decimal('0.1'))
        else:
            review_count = 0
            review_avg_rounded = 0.0

        # 좋아요 수
        place_like_count = PlaceLike.objects.filter(place=post).count()

        # 회원이 좋아요를 한 상태인지
        member = Member.objects.get(id=request.session['member']['id'])
        place_likes = PlaceLike.objects.filter(place=post)
        member_like = False
        for place_like in place_likes:
            try:
                # 해당 Like 객체
                like_object = Like.objects.get(member=member, like_status=True, id=place_like.like_id)
                # 해당 Like 객체가 존재
                member_like = True
            except Like.DoesNotExist:
                # 해당 Like 객체가 없음
                member_like = False

        context = {
            'place': post,
            'place_files': list(post.placefile_set.all()),
            'posts': posts,
            'review_count': review_count,
            'review_avg_rounded': review_avg_rounded,
            'place_like_count': place_like_count,
            'member_like': member_like,
        }
        return render(request, 'place/detail.html', context)

    # -------------결제 부분 주석 포함 87번째 줄부터 추가하시면 됩니다!!!--------------------------------------------------#
    def post(self, request, id):
        # post = 해당 장소 공유 아이디
        post = Place.objects.get(id=id)
        # price = 장소의 포인트 가격
        school = post.school_id
        price = post.place_points
        # place_member = 해당 장소를 공유한 학교 회원 아이디
        place_member = post.school_id
        # 이게 필요한가? 이미 위에서 장소의 학교회원 아이디를 받았는데
        place_member_id = School.objects.get(member_id=school)
        # 그냥 디버깅 용으로 선언한 거임
        print(place_member_id)  # --> 1번 아이디의 학교멤버
        # 학교 회원에서 실제 멤버 아이디를 가져옴
        member = place_member_id.member_id  # --> 3번 아이디의 멤버
        # point 모델에 적립(status=3), 가격 , 멤버를 추가함
        Point.objects.create(member_id=member, point_status=3, point=price)
        # 학교회원의 적립 포인트를 출력한다.
        print(Point.objects.filter(member_id=member, point_status=3).aggregate(Sum('point'))['point__sum'])
        # 구매하려는 대학생 회원 아이디를 가져온다.
        member_id = request.session['member']['id']
        print(member_id)
        university = University.objects.get(member_id=member_id)
        print(university)
        # 장소대여 포인트 모델 을 불러온다.
        place_price = PlacePoints.objects.filter(place_id=post.id)
        # 실제 대학생의 포인트에서 장소대여 포인트 값이 빠져야함
        university.university_member_points -= price
        # 적용된 값 저장
        university.save()

        # 장소대여의 결제 status가 1로 바뀐다.
        place = Place.objects.update(place_order_status=1)

        # point 모델에 사용된 포인트 정보를 추가한다.
        datas = {
            'point': price,
            'point_status': 2,
            'member_id': member_id
        }
        point = Point.objects.create(**datas)
        # place point 모델에 정보를 추가한다. (이미 구매한 사용자면 조회)
        place_data = {
            'place_id': id,
            'points_id': point.id
        }
        PlacePoints.objects.get_or_create(**place_data)
        # ------------------------------결제 부분 완료---------------------------------#
        # --------------------------------멤버 참여 기능 시작---------------------------#
        join_data = {
            'place_member_status': 0,
            'university_id': request.session['member']['id'],
            'place_id': post.id
        }
        PlaceMember.objects.get_or_create(**join_data)
        # --------------------------------멤버 참여 기능 완료---------------------------#
        return redirect('/myPage/main/')


# 좋아요
class PlaceLikeView(View):
    def post(self, request):
        if request.method == 'POST' and request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            # JSON 데이터 파싱
            data = json.loads(request.body)
            place_id = data.get('place_id')
            print(place_id)
            # 해당 place_id 가진 게시글 가져오기
            place = Place.objects.get(id=place_id)
            # 세션에 들어있는 회원
            member = Member.objects.get(id=request.session['member']['id'])

            try:
                # 해당 회원이 이 게시글에 대해 좋아요를 한 경우
                place_like = PlaceLike.objects.get(place=place, like__member=member)
                if place_like.like.like_status:
                    # 이미 좋아요한 경우, 좋아요 취소
                    place_like.like.like_status = False
                    place_like.like.save()  # like_status를 False로 변경
                    place_like.delete()  # 좋아요 삭제
                else:
                    # 이미 좋아요를 취소한 경우
                    # like_status를 True로 변경하여 다시 좋아요를 한 것으로 처리
                    place_like.like.like_status = True
                    place_like.like.save()  # like_status를 True로 변경
            except PlaceLike.DoesNotExist:
                # 해당 회원이 이 게시글에 대해 좋아요를 하지 않은 경우
                # 좋아요 생성
                like = Like.objects.create(member=member, like_status=True)
                place_like = PlaceLike.objects.create(place=place, like=like)

            # 업데이트된 좋아요 수 응답
            place_like_count = PlaceLike.objects.filter(place=place).count()
            return JsonResponse({'like_count': place_like_count})

        # AJAX 요청이 아닌 경우
        return render(request, 'place/detail.html')
class PlaceWriteView(View):
    def get(self, request):
        member = Member.objects.get(id=request.session['member']['id'])
        school_member = School.objects.get(member=member)

        # 마이 포인트
        if len(list(Point.objects.filter(member=member, point_status=3))) > 0:
            point = Point.objects.filter(member=member, point_status=3).aggregate(Sum('point'))['point__sum']
        else:
            point = Point.objects.create(member=member, point_status=3)

        # 마이 포스트 수
        places = Place.enabled_objects.filter(school=school_member).values('place_title', 'id')
        total_post_count = places.count()

        data = {
            'point': point,
            'total_post_count': total_post_count,
            'places': places,
        }
        return render(request, 'place/write.html', data)

    @transaction.atomic
    def post(self, request):
        data = request.POST
        # input 태그 하나에 여러 파일일 때(multiple), getlist('{input태그 name값}')
        files = request.FILES.getlist('upload-file')

        # input 태그 하나 당 파일 1개 일 떄
        # file = request.FILES

        member = Member.objects.get(id=request.session['member']['id'])
        school_member = School.objects.get(member=member)

        data = {
            'place_title': data['place-title'],
            'place_points': data['place-points'],
            'place_date': data['place-date'],
            'place_content': data['place-content'],
            'place_ask_email': data['place-ask-email'],
            'place_url': data['place-url'],
            'school': school_member
        }

        place = Place.objects.create(**data)

        for file in files:
            # 업로드된 파일을 File 모델에 저장
            file_instance = File.objects.create(file_size=file.size)
            PlaceFile.objects.create(place=place, file=file_instance, path=file)

        return redirect(reverse('place:detail', kwargs={'id': place.id}))

class PlaceUpdateView(View):
    def get(self, request, id):
        member = Member.objects.get(id=request.session['member']['id'])
        school_member = School.objects.get(member=member)

        # 마이 포인트
        if len(list(Point.objects.filter(member=member, point_status=3))) > 0:
            point = Point.objects.filter(member=member, point_status=3).aggregate(Sum('point'))['point__sum']
        else:
            point = Point.objects.create(member=member, point_status=3)

        # 마이 포스트 수
        places = Place.enabled_objects.filter(school=school_member).values('place_title', 'id')
        total_post_count = places.count()

        post = Place.objects.get(id=id)
        # update_url 생성
        update_url = reverse('place:update', args=[id])
        place_content = post.place_content.strip()
        context = {
            'place': post,
            'place_content': place_content,
            'place_files': list(post.placefile_set.all()),
            'update_url': update_url,
            'point': point,
            'total_post_count': total_post_count,
        }
        return render(request, 'place/update.html', context)

    def post(self, request, id):
        data = request.POST
        place_id = data['id']
        # 기존의 Place 객체 가져오기
        place = Place.objects.get(id=id)

        place.place_title = data['place-title']
        place.place_content = data['place-content']
        place.place_ask_email = data['place-ask-email']
        place.place_url = data['place-url']
        place.place_date = data['place-date']
        place.place_points = data['place-points']
        place.save(update_fields=['place_title', 'place_content', 'place_ask_email', 'place_url', 'place_date',
                                  'place_points'])

        # 새로운 파일들이 있는지 확인
        files = request.FILES.getlist('upload-file')

        # 새로운 파일들이 없는 경우 기존 파일들 유지
        if not files:
            # 수정된 Place의 상세 페이지로 이동
            return redirect(reverse('place:detail', kwargs={'id': place_id}))

        # 기존의 파일들 삭제
        place.placefile_set.all().delete()

        # 새로운 파일들 처리
        for file in files:
            # 파일 저장
            file_instance = File.objects.create(file_size=file.size)
            PlaceFile.objects.create(place=place, file=file_instance, path=file)

        return redirect(reverse('place:detail', kwargs={'id': place_id}))

class PlaceDeleteView(View):
    def get(self, request):
        place_id = request.GET['id']
        Place.objects.filter(id=place_id).update(place_post_status=False)  # 수정
        return redirect('/place/list')

class PlaceReviewListView(View):
    def get(self, request):
        # URL에서 전달된 ID 값 가져오기
        place_id = request.GET.get('place_id')
        # 가져온 ID를 이용하여 해당하는 데이터 가져오기
        post = Place.objects.get(id=place_id)
        # 좋아요 수
        place_like_count = PlaceLike.objects.filter(place=post).count()
        postData = {
            'place_id': post.id,
            'place_title': post.place_title,
            'place_points': post.place_points,
            'place_date': post.place_date,
            'place_content': post.place_content,
            'place_ask_email': post.place_ask_email,
            'place_url': post.place_url,
            'school_member_address': post.school.school_member_address,
            'school_name': post.school.school_name,
            'member_name': post.school.member.member_name,
            'member_email': post.school.member.member_email,
            'place_files': post.placefile_set.all(),
            'place_like_count': place_like_count,
        }

        return render(request, 'place/review.html', postData)

class PlaceReviewListAPIView(APIView):
    @transaction.atomic
    def get(self, request, place_id, page):
        row_count = 5

        offset = (page - 1) * row_count
        limit = page * row_count

        datas = [
            'review__id',
            'review__review_content',
            'review__review_rating',
            'member_name',
            'review__member',
            'review__member__member_school_email',
            'review__created_date',
        ]

        # 정렬 방식에 따라 쿼리셋을 정렬
        sort = request.GET.get('sort', 'latest')
        if sort == 'highest_rating':
            reviews = PlaceReview.enabled_objects.filter(place_id=place_id).annotate(member_name=F('review__member__member_name'))\
                      .values(*datas).order_by('-review__review_rating', '-review__created_date')[offset:limit]
        elif sort == 'lowest_rating':
            reviews = PlaceReview.enabled_objects.filter(place_id=place_id).annotate(member_name=F('review__member__member_name'))\
                      .values(*datas).order_by('review__review_rating', '-review__created_date')[offset:limit]
        else:  # default to latest
            reviews = PlaceReview.enabled_objects.filter(place_id=place_id).annotate(member_name=F('review__member__member_name'))\
                      .values(*datas).order_by('-review__created_date')[offset:limit]

        # 리뷰 개수 가져오기
        total_review_count = PlaceReview.enabled_objects.filter(place_id=place_id).count()

        # 리뷰가 없을 때 처리
        if total_review_count == 0:
            return Response({
                'reviews': [], 'hasNext': False, 'place_id': place_id, 'review_count': 0.0, 'review_avg': 0.0
            })

        # 리뷰 평균
        review_avg_decimal = \
        PlaceReview.enabled_objects.filter(place_id=place_id).aggregate(avg_rating=Avg('review__review_rating'))['avg_rating']
        review_avg_rounded = Decimal(review_avg_decimal).quantize(Decimal('0.1'))  # 수정

        # 다음 페이지가 있는지 계산할 때도 전체 리뷰 개수를 사용하여 계산
        has_next = total_review_count > offset + limit

        # 리뷰 개수와 평균을 response에 추가
        review_info = {
            'reviews': [],
            'hasNext': has_next,
            'place_id': place_id,
            'review_count': total_review_count,  # 전체 리뷰 개수 사용
            'review_avg': float(review_avg_rounded),  # 반올림된 값
        }
        for review in reviews:
            review_one_id = review['review__id']
            review_one = Review.objects.get(id=review_one_id)
            review_files = review_one.reviewfile_set.all()
            member_one_id = review['review__member']
            member_profiles = MemberFile.objects.filter(member_id=member_one_id)

            # 리뷰 파일 데이터를 리스트에 추가
            review_file_info = []
            for file in review_files:
                file_info = {
                    'id': file.pk,
                    'path': file.path.url  # 파일의 경로를 나타내는 속성
                }
                review_file_info.append(file_info)

            # 리뷰 정보에 파일 정보를 추가
            review['review_files'] = review_file_info

            # 멤버 프로필 이미지 리스트에 추가
            profile_file_info = []
            for profile in member_profiles:
                profile_info = {
                    'path': profile.path.url
                }
                profile_file_info.append(profile_info)

            review['profile_files'] = profile_file_info

            # 리뷰 정보를 review_info에 추가
            review_info['reviews'].append(review)

        return Response(review_info)

class PlaceListView(View):
    def get(self, request):
        place_total_count = Place.enabled_objects.all().count()
        data = {'place_total_count': place_total_count}
        return render(request, 'place/list.html', data)

class PlaceListAPIView(APIView):
    def get(self, request, page):
        # 한 페이지에 보여줄 장소의 개수와 페이지당 표시할 최대 페이지 수 설정
        row_count = 9

        offset = (page - 1) * row_count
        limit = page * row_count

        datas = [
            'id',
            'place_title',
            'place_points',
            'place_address',
            'university_name',
            'place_date',
        ]

        # 지역 필터
        area_sort = request.GET.get('areaSort', 'all')
        if area_sort == 'all':
            places = Place.enabled_objects.all()
        else:
            # 해당 지역에 속한 학교 가져오기
            # strip = 공백 제거
            places = Place.enabled_objects.filter(school__school_member_address__contains=area_sort.strip())

        # 선택된 지역에 따라 필터링된 장소 목록 가져오기
        places = places.annotate(place_address=F('school__school_member_address'),\
                                 university_name=F('school__school_name'))\
                                .values(*datas).order_by('-id')
        place_count = places.count()
        places = places[offset:limit]
        # 다음 페이지가 있는지 계산
        has_next = place_count > offset + limit

        # 회원이 좋아요를 한 상태인지
        member = Member.objects.get(id=request.session['member']['id'])

        place_info = {
            'places': [],
            'member_like': {},
        }

        for place in places:
            place_one_id = place['id']
            place_one = Place.objects.get(id=place_one_id)
            place_files = place_one.placefile_set.all()

            # 장소공유 파일 데이터를 리스트에 추가
            place_file_info = []
            for file in place_files:
                file_info = {
                    'id': file.pk,
                    'path': file.path.url,  # 파일의 경로를 나타내는 속성
                }
                place_file_info.append(file_info)

            # 장소 정보에 파일 정보를 추가
            place['place_files'] = place_file_info

            # 해당 장소에 대한 회원의 좋아요 여부 확인
            try:
                like_object = PlaceLike.objects.get(like__member=member, like__like_status=True, place=place_one)
                place_info['member_like'][place_one_id] = True
            except PlaceLike.DoesNotExist:
                place_info['member_like'][place_one_id] = False

            place_info['places'].append(place)

        return Response(place_info)