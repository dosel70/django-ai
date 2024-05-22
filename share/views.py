import math
import mimetypes
import os
from decimal import Decimal
from urllib.parse import urlparse

from django.core.files.storage import FileSystemStorage
from django.core.paginator import Paginator
from django.db import transaction
from django.db.models import Avg, F, Q, Subquery, Count, Sum
from django.http import JsonResponse, FileResponse
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
from onelabMember.models import OneLabMember
from point.models import Point
from review.models import Review
from share.models import Share, ShareFile, ShareReview, ShareLike, SharePoints
from oneLabProject.settings import MEDIA_URL
from shareMember.models import ShareMember
from university.models import University


class ShareDetailView(View):
    def get(self, request, id):
        post = Share.objects.get(id=id)

        university_member = University.objects.get(member=post.university)
        post_list = Share.enabled_objects.filter(university=university_member).order_by('-id')
        page = request.GET.get('page', 1)
        paginator = Paginator(post_list, 4)
        posts = paginator.page(page)

        # 파일 가져오기
        for p in posts:
            first_file = p.sharefile_set.first()
            if first_file:
                file_name = first_file.path.name
                file_extension = file_name.split('.')[-1].lower()  # 파일 확장자 추출
                p.file_extension = file_extension
                # 파일이 있으면 파일의 경로를 기반으로 URL 생성
                p.image_url = f"{MEDIA_URL}{first_file.path}"
            else:
                p.image_url = None

        # 리뷰 평균과 개수
        reviews = ShareReview.enabled_objects.filter(share_id=post.id)
        if len(reviews) > 0:
            review_count = reviews.count()
            review_avg_decimal = reviews.aggregate(avg_rating=Avg('review__review_rating'))['avg_rating']
            review_avg_rounded = Decimal(review_avg_decimal).quantize(Decimal('0.1'))
        else:
            review_count = 0
            review_avg_rounded = 0.0

        # 좋아요 수
        share_like_count = ShareLike.objects.filter(share=post).count()

        # 원랩 수
        onelabs = OneLab.objects.filter(university=university_member)
        onelab_count = onelabs.count()

        # 회원이 좋아요를 한 상태인지
        member = Member.objects.get(id=request.session['member']['id'])
        share_likes = ShareLike.objects.filter(share=post)
        member_like = False
        for share_like in share_likes:
            try:
                # 해당 Like 객체를 가져옵니다.
                like_object = Like.objects.get(member=member, like_status=True, id=share_like.like_id)
                # 예외가 발생하지 않았으므로, 해당 Like 객체가 존재합니다.
                member_like = True
            except Like.DoesNotExist:
                # 해당 Like 객체가 존재하지 않습니다.
                member_like = False

        profile = MemberFile.objects.filter(member=university_member.member)
        if profile:
            profile = profile[0]
        # print(profile.path)

        context = {
            'share': post,
            'share_files': list(post.sharefile_set.all()),
            'posts': posts,
            'review_count': review_count,
            'review_avg_rounded': review_avg_rounded,
            'share_like_count': share_like_count,
            'onelab_count': onelab_count,
            'university_member': university_member,
            'member_like': member_like,
            'profile': profile.path,
        }

        return render(request, 'share/detail.html', context)

    # ------------------------------------------------------------------------------
    def post(self, request, id):
        post = Share.objects.get(id=id)  # 자료공유 상세보기 아이디를 가져옴
        member = request.session['member']['id']
        university = post.university_id
        price = post.share_points
        share_member = University.objects.get(member=university)  # 판매자
        pay_member = University.objects.get(member=member)  # 구매자
        # 결제 버튼 클릭 시 기능
        share_member_id = share_member.member_id  # 판매자 실제 아이디
        Point.objects.create(member_id=share_member_id, point_status=3, point=price)
        pay_member_id = pay_member.member_id  # 구매자 실제 아이디
        point = Point.objects.create(member_id=pay_member_id, point_status=2, point=price)

        share_data = {
            'points_id': point.id,
            'share_id': post.id
        }
        SharePoints.objects.get_or_create(**share_data)

        if pay_member.university_member_points < price:
            return render(request, 'share/list.html')
        else:
            # ------ 적립, 사용 잔액 기능 구현 --------------- #
            share_member.university_member_points += price
            before = share_member.save()
            print(before)
            # ----- 판매자는 적립금액 들어옴 --------------#
            pay_member.university_member_points -= price
            after = pay_member.save()
            print(after)
            # ----- 구매자는 사용금액 차감됨 -------------- #

        # ----멤버 결제 내역 기능 시작 --------------#
        join_data = {
            'share_member_status': 0,
            'university_id': request.session['member']['id'],
            'share_id': post.id
        }
        ShareMember.objects.get_or_create(**join_data)
        # ------- 멤버 결제 내역 기능 완료 --------- #
        return redirect('/myPage/main/')


# 좋아요
class ShareLikeView(View):
    def post(self, request):
        if request.method == 'POST' and request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            # json 받아오기
            data = json.loads(request.body)
            share_id = data.get('share_id')
            # 해당 share_id 가진 게시글 가져오기
            share = Share.objects.get(id=share_id)
            # 세션에 들어있는 회원
            member = Member.objects.get(id=request.session['member']['id'])

            try:
                # 해당 회원이 이 게시글에 대해 좋아요를 한 경우
                share_like = ShareLike.objects.get(share=share, like__member=member)
                if share_like.like.like_status:
                    # 이미 좋아요한 경우, 좋아요 취소
                    share_like.like.like_status = False
                    share_like.like.save()  # like_status를 False로 변경
                    share_like.delete()  # 좋아요 삭제
                else:
                    # 이미 좋아요를 취소한 경우
                    # like_status를 True로 변경하여 다시 좋아요를 한 것으로 처리
                    share_like.like.like_status = True
                    share_like.like.save()  # like_status를 True로 변경
            except ShareLike.DoesNotExist:
                # 해당 회원이 이 게시글에 대해 좋아요를 하지 않은 경우
                # 좋아요 생성
                like = Like.objects.create(member=member, like_status=True)
                share_like = ShareLike.objects.create(share=share, like=like)

            # 좋아요 수 응답하기
            share_like_count = ShareLike.objects.filter(share=share).count()
            return JsonResponse({'like_count': share_like_count})

        # AJAX 요청이 아닌 경우
        return render(request, 'share/detail.html')


class ShareWriteView(View):
    def get(self, request):
        member = Member.objects.get(id=request.session['member']['id'])
        university_member = University.objects.get(member=member)

        # 학교 이메일 도메인 부분 추출
        school_domain = member.member_school_email.split('@')[1]

        if 'kaist' in member.member_school_email:
            university_member.university_member_school = '카이스트'
        elif 'snu' in member.member_school_email:
            university_member.university_member_school = '서울대학교'
        elif 'yonsei' in member.member_school_email:
            university_member.university_member_school = '연세대학교'
        elif 'korea' in member.member_school_email:
            university_member.university_member_school = '고려대학교'
        else:
            university_member.university_member_school = school_domain

        university_member.save()

        # 마이 포인트
        if len(list(Point.objects.filter(member=member, point_status=3))) > 0:
            point = Point.objects.filter(member=member, point_status=3).aggregate(Sum('point'))['point__sum']
        else:
            point = Point.objects.create(member=member, point_status=3).point

        # 마이 포스트 수
        share_post_count = Share.enabled_objects.filter(university=university_member).count()
        community_post_count = Community.objects.filter(
            member=member).count()  # community, onelab도 enabled_objects로 바꾸기
        onelab_post_count = OneLab.objects.filter(university=university_member).count()
        total_post_count = share_post_count + community_post_count + onelab_post_count

        # 마이 원랩 수
        onelabs = OneLab.objects.filter(university=university_member)
        onelab_count = onelabs.count()

        data = {
            'point': point,
            'total_post_count': total_post_count,
            'onelab_count': onelab_count,
        }

        return render(request, 'share/write.html', data)

    @transaction.atomic
    def post(self, request):
        data = request.POST
        # input 태그 하나에 여러 파일일 때(multiple), getlist('{input태그 name값}')
        file = request.FILES

        # input 태그 하나 당 파일 1개 일 떄
        # file = request.FILES

        # school = Member(**request.session['member'])

        member = University.objects.get(member_id=request.session['member']['id'])

        data = {
            'share_title': data['share-title'],
            'share_points': data['share-points'],
            'share_choice_major': data['share-choice-major'],
            'share_choice_grade': data['share-choice-grade'],
            'share_content': data['share-content'],
            'share_type': data['share-type'],
            'share_text_major': data['share-text-major'],
            'share_text_name': data['share-text-name'],
            'university': member,
        }

        share = Share.objects.create(**data)

        for key, file in file.items():
            file_instance = File.objects.create(file_size=file.size)
            ShareFile.objects.create(share=share, file=file_instance, path=file)

        return redirect(reverse('share:detail', kwargs={'id': share.id}))


class ShareDownloadView(View):
    def get(self, request, file_path, *args, **kwargs):
        file_name = file_path.split('/')[-1]
        file_path = file_path

        # print(file_path, file_name)
        # file_path: 파일이 있는 경로 설정, 경로에 파일 이름 포함 가능
        fs = FileSystemStorage()
        # fs.open("파일 이름", 'rb')
        content_type, _ = mimetypes.guess_type(file_name)
        response = FileResponse(fs.open(file_path, 'rb'),
                                content_type=content_type)
        response['Content-Disposition'] = f'attachment; filename="{file_name}"'

        return response


class ShareUpdateView(View):
    def get(self, request, id):
        member = Member.objects.get(id=request.session['member']['id'])
        university_member = University.objects.get(member=member)

        # 마이 포인트
        if len(list(Point.objects.filter(member=member, point_status=3))) > 0:
            point = Point.objects.filter(member=member, point_status=3).aggregate(Sum('point'))['point__sum']
        else:
            point = Point.objects.create(member=member, point_status=3)

        # 마이 포스트 수
        share_post_count = Share.enabled_objects.filter(university=university_member).count()
        community_post_count = Community.objects.filter(
            member=member).count()  # community, onelab도 enabled_objects로 바꾸기
        onelab_post_count = OneLab.objects.filter(university=university_member).count()
        total_post_count = share_post_count + community_post_count + onelab_post_count

        # 마이 원랩 수
        onelabs = OneLab.objects.filter(university=university_member)
        onelab_count = onelabs.count()

        post = Share.objects.get(id=id)
        # update_url 생성
        update_url = reverse('share:update', args=[id])
        context = {
            'share': post,
            'share_files': list(post.sharefile_set.all()),
            'update_url': update_url,
            'point': point,
            'total_post_count': total_post_count,
            'onelab_count': onelab_count,
        }
        return render(request, 'share/update.html', context)

    def post(self, request, id):
        data = request.POST
        # share_id = data['id']
        # 기존의 Share 객체 가져오기
        share = Share.objects.get(id=id)

        share.share_title = data['share-title']
        share.share_content = data['share-content']
        share.share_choice_major = data['share-choice-major']
        share.share_choice_grade = data['share-choice-grade']
        share.share_type = data['share-type']
        share.share_points = data['share-points']
        share.share_text_name = data['share-text-name']
        share.share_text_major = data['share-text-major']
        share.save(
            update_fields=['share_title', 'share_content', 'share_choice_major', 'share_choice_grade', 'share_type',
                           'share_points', 'share_text_name', 'share_text_major'])

        # 새로운 파일들이 있는지 확인
        files = request.FILES.getlist('upload-file')

        # 새로운 파일들이 없는 경우 기존 파일들 유지
        if not files:
            # 수정된 Share의 상세 페이지로 이동
            return redirect(share.get_absolute_url())

        # 기존의 파일들 삭제
        share.sharefile_set.all().delete()

        # 새로운 파일들 처리
        for file in files:
            # 파일 저장
            file_instance = File.objects.create(file_size=file.size)
            ShareFile.objects.create(share=share, file=file_instance, path=file)

        return redirect(share.get_absolute_url())


class ShareDeleteView(View):
    def get(self, request):
        share_id = request.GET['id']
        Share.objects.filter(id=share_id).update(share_post_status=False)  # 수정
        return redirect('/share/list')


class ShareListView(View):
    def get(self, request):
        return render(request, 'share/list.html')


class ShareListAPIView(APIView):
    @transaction.atomic
    def get(self, request, page):
        row_count = 12

        offset = (page - 1) * row_count
        limit = page * row_count

        datas = [
            'id',
            'share_title',
            'share_points',
            'share_choice_major',
            'created_date',
            'member_name',
            'university_name',
            'share_like_count',
            'share_choice_grade',
        ]

        # 학년 필터
        grade_sort = request.GET.get('gradeSort', 'all')
        if grade_sort == 'all':
            shares = Share.enabled_objects.all()
        else:
            shares = Share.enabled_objects.filter(share_choice_grade__contains=grade_sort)

        # 학과 필터
        major_sort = request.GET.get('majorSort', 'all')
        if major_sort != 'all':
            shares = shares.filter(share_choice_major__contains=major_sort)

        # 인기순 필터
        sort_order = request.GET.get('sortOrder', 'latest')
        if sort_order != 'latest':
            shares = shares.annotate(share_like_count=Count('sharelike')).order_by('-share_like_count', '-id')
        else:
            shares = shares.annotate(share_like_count=Count('sharelike')).order_by('-id')

        shares = shares.annotate(member_name=F('university__member__member_name'),
                                 university_name=F('university__university_member_school')) \
            .values(*datas)
        share_count = shares.count()
        shares = shares[offset:limit]

        # 다음 페이지가 있는지 계산
        has_next = share_count > offset + limit

        share_info = {
            'shares': [],
            'hasNext': has_next,
            'member_like': {},
        }

        for share in shares:
            share_one_id = share['id']
            share_one = Share.objects.get(id=share_one_id)
            share_files = share_one.sharefile_set.all()

            # 자료공유 파일 데이터를 리스트에 추가
            share_file_info = []
            for file in share_files:
                file_info = {
                    'id': file.pk,
                    'path': file.path.url,  # 파일의 경로를 나타내는 속성
                    'file_extension': file.path.url.split('.')[-1].lower()
                }
                share_file_info.append(file_info)

            # 리뷰 정보에 파일 정보를 추가
            share['share_files'] = share_file_info

            # 회원이 좋아요를 한 상태인지
            member = Member.objects.get(id=request.session['member']['id'])

            # 해당 장소에 대한 회원의 좋아요 여부 확인
            try:
                like_object = ShareLike.objects.get(like__member=member, like__like_status=True, share=share_one)
                share_info['member_like'][share_one_id] = True
            except ShareLike.DoesNotExist:
                share_info['member_like'][share_one_id] = False

            # 리뷰 정보를 review_info에 추가
            share_info['shares'].append(share)

        return Response(share_info)


class ShareReviewListView(View):
    def get(self, request):
        # URL에서 전달된 ID 값 가져오기
        share_id = request.GET.get('share_id')
        # 가져온 ID를 이용하여 해당하는 데이터 가져오기
        post = Share.objects.get(id=share_id)
        # 좋아요 수
        share_like_count = ShareLike.objects.filter(share=post).count()

        # 파일
        share = Share.objects.get(id=share_id)
        share_file = ShareFile.objects.filter(share=share).first()
        share_file_extension = share_file.file_extension

        # 원랩 수
        share_member = University.objects.get(member=share.university)
        onelab_manager_count = OneLab.objects.filter(university=share_member).count()
        onelab_member_count = OneLabMember.objects.filter(university=share_member).count()
        total_onelab_count = onelab_manager_count + onelab_member_count

        post_list = Share.enabled_objects.filter(university=share_member).order_by('-id')
        page = request.GET.get('page', 1)
        paginator = Paginator(post_list, 4)
        posts = paginator.page(page)

        # 회원이 좋아요를 한 상태인지
        member = Member.objects.get(id=request.session['member']['id'])
        share_likes = ShareLike.objects.filter(share=share)
        member_like = False
        for share_like in share_likes:
            try:
                # 해당 Like 객체를 가져옵니다.
                like_object = Like.objects.get(member=member, like_status=True, id=share_like.like_id)
                # 예외가 발생하지 않았으므로, 해당 Like 객체가 존재합니다.
                member_like = True
            except Like.DoesNotExist:
                # 해당 Like 객체가 존재하지 않습니다.
                member_like = False

        profile = MemberFile.objects.filter(member=share_member.member)
        if profile:
            profile = profile[0]

        post_data = {
            'share_id': post.id,
            'share_title': post.share_title,
            'share_points': post.share_points,
            'share_content': post.share_content,
            'university_member_school': post.university.university_member_school,
            'university_member_major': post.university.university_member_major,
            'share_text_name': post.share_text_name,
            'member_name': post.university.member.member_name,
            'share_text_major': post.share_text_major,
            'share_choice_major': post.share_choice_major,
            'share_choice_grade': post.share_choice_grade,
            'file_path': post.sharefile_set.all().values('path'),
            'share_like_count': share_like_count,
            'share_file_extension': share_file_extension,
            'total_onelab_count': total_onelab_count,
            'member_like': member_like,
            'posts': posts,
            'profile': profile.path,
        }

        return render(request, 'share/review.html', post_data)


class ShareReviewListAPIView(APIView):
    @transaction.atomic
    def get(self, request, share_id, page):
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
            reviews = ShareReview.enabled_objects.filter(share_id=share_id).annotate(
                member_name=F('review__member__member_name')) \
                .values(*datas).order_by('-review__review_rating', '-review__created_date')
        elif sort == 'lowest_rating':
            reviews = ShareReview.enabled_objects.filter(share_id=share_id).annotate(
                member_name=F('review__member__member_name')) \
                .values(*datas).order_by('review__review_rating', '-review__created_date')
        else:  # default to latest
            reviews = ShareReview.enabled_objects.filter(share_id=share_id).annotate(
                member_name=F('review__member__member_name')) \
                .values(*datas).order_by('-review__created_date')

        reviews = reviews[offset:limit]
        # 리뷰 개수 가져오기
        total_review_count = ShareReview.enabled_objects.filter(share_id=share_id).count()

        # 리뷰가 없을 때 처리
        if total_review_count == 0:
            return Response({
                'reviews': [], 'hasNext': False, 'share_id': share_id, 'review_count': 0.0, 'review_avg': 0.0
            })

        # 리뷰 평균
        review_avg_decimal = \
            ShareReview.enabled_objects.filter(share_id=share_id).aggregate(avg_rating=Avg('review__review_rating'))[
                'avg_rating']
        review_avg_rounded = Decimal(review_avg_decimal).quantize(Decimal('0.1'))  # 수정

        # 다음 페이지가 있는지 계산할 때도 전체 리뷰 개수를 사용하여 계산
        has_next = total_review_count > offset + limit

        # 리뷰 개수와 평균을 response에 추가
        review_info = {
            'reviews': [],
            'hasNext': has_next,
            'share_id': share_id,
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