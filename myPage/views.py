from profile import Profile
import json
from oneLabProject.settings import MEDIA_URL
from django.core.paginator import Paginator, EmptyPage
from django.db.models import Sum, F
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.views import View
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView

from onelab.models import OneLab, OneLabFile, OneLabBannerFile
from onelabMember.models import OneLabMember
from place.models import Place, PlaceLike, PlaceFile
from community.models import Community, CommunityFile
from exhibition.models import Exhibition, ExhibitionFile
# from exhibitionMember.models import ExhibitionMember
from highschool.models import HighSchool
from member.models import Member, MemberFile
from member.serializers import MemberSerializer
from place.views import PlaceListAPIView
from placeMember.models import PlaceMember
from point.serializers import PointSerializer
from point.models import Point
from school.models import School
from share.models import Share, SharePoints, ShareFile
from shareMember.models import ShareMember
from university.models import University
from file.models import File
from django.core.exceptions import ObjectDoesNotExist
import math
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
import math


from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import render
from django.views import View
from django.http import JsonResponse

class MyPageMainView(View):
    def get(self, request):
        member_id = request.session['member']['id']
        university = University.objects.filter(member_id=member_id).first()
        highschool = HighSchool.objects.filter(member_id=member_id).first()
        school = School.objects.filter(member_id=member_id).first()
        profile = MemberFile.objects.filter(member_id=member_id).first()


        # 공모전 목록 가져오기

        if university:
            exhibitions = Exhibition.objects.filter(exhibitionmember__university=university).order_by('-id')

        elif school:
            exhibitions = Exhibition.objects.filter(school=school).order_by('-id')

        request.session['member'] = MemberSerializer(Member.objects.get(id=request.session['member']['id'])).data
        check = request.GET.get('check')

        point = request.GET.get('point')
        # 커뮤니티 목록 가져오기
        community = Community.objects.filter(member_id=member_id, status=0).order_by('-id')


        # 세션 정보 최신화
        request.session['member'] = MemberSerializer(Member.objects.get(id=request.session['member']['id'])).data
        check = request.GET.get('check')

        # 자료 공유 목록을 가져오는 로직
        share_university = University.objects.filter(member_id=member_id).first()

        # 작성자가 공유한 목록
        share_write = Share.objects.filter(university=share_university).order_by('-id')

        # 구매자가 구매한 목록
        share_pay = ShareMember.objects.filter(university=share_university).order_by('-id')

        # 페이지 번호
        page = request.GET.get('page', 1)

        # 페이지당 행 수
        share_row_count = 80

        # 필터링된 자료 공유 목록을 페이지별로 나눔
        share_paginator = Paginator(share_write if share_write else share_pay, share_row_count)

        try:
            shares = share_paginator.page(page)
        except PageNotAnInteger:
            # 페이지 번호가 정수가 아닌 경우, 첫 페이지를 반환
            shares = share_paginator.page(1)
        except EmptyPage:
            # 페이지가 비어 있는 경우, 마지막 페이지를 반환
            shares = share_paginator.page(share_paginator.num_pages)

            # 파일 가져오기
            for p in shares:
                first_file = p.sharefile_set.first()
                if first_file:
                    file_name = first_file.path.name
                    file_extension = file_name.split('.')[-1].lower()  # 파일 확장자 추출
                    p.file_extension = file_extension
                    # 파일이 있으면 파일의 경로를 기반으로 URL 생성

                    p.image_url = f"{MEDIA_URL}{first_file.path}"
                else:
                    p.image_url = None

        # 장소 공유 목록을 가져오는 로직
        school = School.objects.filter(member_id=member_id).first()
        place = Place.objects.filter(school=school, place_post_status=1).order_by('-id')
        page = request.GET.get('page', 1)

        places = None
        if university:
            places = Place.objects.filter(placemember__university=request.session['member']['id'], place_order_status=1).order_by('-id')
        elif school:
            places = Place.objects.filter(school=school, place_post_status=1).order_by('-id')

        place_row_count = 9
        place_paginator = Paginator(place, place_row_count)

        if places:
            try:
                places = place_paginator.page(page)
            except PageNotAnInteger:
                places = place_paginator.page(1)
            except EmptyPage:
                places = place_paginator.page(place_paginator.num_pages)
        else:
            places = None

        # 장소공유 목록 가져오기
        place1 = PlaceMember.objects.filter(place_member_status=0, university=university).order_by('-id')

        # 커뮤니티 목록 가져오기
        community = Community.objects.filter(member_id=member_id).order_by('-id')

        # 커뮤니티 페이징 처리
        page = request.GET.get('page', 1)
        community_row_count = 5
        community_paginator = Paginator(community, community_row_count)
        try:
            communities = community_paginator.page(page)
        except PageNotAnInteger:
            communities = community_paginator.page(1)
        except EmptyPage:
            communities = community_paginator.page(community_paginator.num_pages)

        # 공모전 페이징 처리
        # exhibitions_row_count = 3
        # exhibitions_paginator = Paginator(exhibitions, exhibitions_row_count)
        #
        # if exhibitions:
        #     try:
        #         exhibitions = exhibitions_paginator.page(page)
        #     except PageNotAnInteger:
        #         exhibitions = exhibitions_paginator.page(1)
        #     except EmptyPage:
        #         exhibitions = exhibitions_paginator.page(exhibitions_paginator.num_pages)
        # else:
        #     exhibitions = None
        #
        default_profile_url = 'https://static.wadiz.kr/assets/icon/profile-icon-1.png'

        if profile is None:
            profile = default_profile_url

        context = {
            'members': request.session['member'],
            'member_id': member_id,
            'profile': profile,
            'check': check,
            'communities': communities,
        }

        if highschool:
            context['community_file'] = CommunityFile.objects.filter(community_id=community.first()).first()
            context['highschool'] = highschool

        if university:
            places = Place.objects.filter(placemember__university=university, placemember__place_member_status=0)
            context['community_file'] = CommunityFile.objects.filter(community_id=community.first()).first()
            context['current_point'] = university.university_member_points
            context['member_major'] = university.university_member_major
            context['member_school'] = university.university_member_school
            context['places'] = places
            context['place_file'] = PlaceFile.objects.filter(place_id=places.first()).first()
            context['shares'] = shares
            context['exhibitions'] = exhibitions
            # context['share_file'] = list(shares.sharefile_set.all()),


        if school:
            member = request.session['member']['id']
            context['place_file'] = PlaceFile.objects.filter(place_id=place.first()).first()
            context['current_point'] = Point.objects.filter(member_id=member, point_status=3).aggregate(Sum('point'))['point__sum']
            context['places'] = places
            context['school'] = school
            # context['places'] = places_page
            context['exhibitions'] = exhibitions
        # else :
        #     context['exhibitions'] = exhibitions
        else :
            context['community_file'] = CommunityFile.objects.filter(community_id=community.first()).first()
            # context['exhibitions'] = exhibitions
        return render(request,
                      'mypage/main-high.html' if highschool else 'mypage/main-university.html' if university else 'mypage/main.html'
                      if school else 'mypage/main-nomal.html', context)



    def post(self, request):
        data = request.POST
        file = request.FILES.get('profile')  # 'profile'은 input의 name 속성

        print('POST 들어옴')
        member = Member.objects.get(id=request.session['member']['id'])
        member_file = MemberFile.objects.filter(member=member).first()
        print(member.id)

        if file:  # 파일이 존재하는 경우에만 처리
            if member_file is None:
                file_instance = File.objects.create(file_size=file.size)
                member_file = MemberFile.objects.create(member=member, file=file_instance, path=file)
            else:
                file_instance = member_file.file
                file_instance.file_size = file.size
                file_instance.save()
                member_file.path = file

            member_file.save()

        # member_files = list(member.memberfile_set.values('path'))
        request.session['member_files'] = list(member.memberfile_set.values('path'))
        print(request.session['member_files'])
        print(request.session['member_files'],'이것좀 봐바!!!!!')

        # if len(member_files) != 0:
        #     request.session['member_files'] = member_files
        return redirect('myPage:main')


class MyPageOnelabAPI(APIView):
    def get(self, request):
        member_id = request.session['member']['id']
        is_member = request.GET.get('is-member')
        university = University.objects.filter(member_id=member_id).first()
        if not university:
            return Response("fail")

        onelabs = []
        if is_member == 'false':
            # 랩장
            onelabs = OneLab.objects.filter(university=university)
        else:
            # 랩원
            onelab_ids = OneLabMember.objects.filter(university=university, onelab_member_status__in=(0, 1)).values_list('onelab_id', flat=True)
            onelabs = OneLab.objects.filter(id__in=onelab_ids)

        # 데이터 준비
        data = []
        for onelab in onelabs:
            onelab_data = {
                'id': onelab.id,
                'onelab_main_title': onelab.onelab_main_title,
                'onelab_content': onelab.onelab_content,
                'onelab_detail_content': onelab.onelab_detail_content,
                'onelab_url': onelab.onelab_url,
                'onelab_max_count': onelab.onelab_max_count,
                'onelab_ask_email': onelab.onelab_ask_email,
                'onelab_status': onelab.onelab_status,
                'onelab_post_status': onelab.onelab_post_status,
                'university_id': onelab.university_id,
                'path': None  # 기본값 설정
            }

            # OneLabFile 확인
            onelab_file = OneLabFile.objects.filter(onelab=onelab).first()
            if onelab_file:
                onelab_data['path'] = onelab_file.path.url

            # OneLabBannerFile 확인 - 예시로 추가
            onelab_banner_file = OneLabFile.objects.filter(onelab=onelab).first()
            if onelab_banner_file:
                onelab_data['banner_path'] = onelab_banner_file.path.url

            data.append(onelab_data)

        return Response(data)

# class MyPagePlaceAPIView(APIView):
#     def get(self, request, page):
#         # 로그인 된 회원 정보 불러옴 -> id
#         member =request.session['member']['id']
#         # 학교회원의 정보를 불러옴 -> id
#         school = School.objects.filter(member=member).first()
#
#         # 한 페이지에 보여줄 장소의 개수와 페이지당 표시할 최대 페이지 수 설정
#         row_count = 4
#
#         offset = (page - 1) * row_count
#         limit = page * row_count
#
#         datas = [
#                 'id',
#                 'place_title'
#         ]
#
#         # 필터링된 장소 목록 가져오기
#         places = Place.enabled_objects.filter(member=member).values(*datas).order_by('-id')
#         place_count = places.count()
#         places = places[offset:limit]
#         # 다음 페이지가 있는지 계산
#         has_next = place_count > offset + limit
#
#         place_info = {
#             'places': [],
#             'member_like': {},
#         }
#
#         for place in places:
#             place_one_id = place['id']
#             place_one = Place.objects.get(id=place_one_id)
#             place_files = place_one.placefile_set.all()
#
#             # 장소공유 파일 데이터를 리스트에 추가
#             place_file_info = []
#             for file in place_files:
#                 file_info = {
#                     'id': file.pk,
#                     'path': file.path.url,  # 파일의 경로를 나타내는 속성
#                 }
#                 place_file_info.append(file_info)
#
#             # 장소 정보에 파일 정보를 추가
#             place['place_files'] = place_file_info
#
#             place_info['places'].append(place)
#
#         return Response(place_info)

class MyPageCommunityView(View):
    def get(self, request):
        member = Member.objects.get(id=request.session['member']['id'])
        community = Community.objects.get(member_id=member).first()
        community_file = CommunityFile.objects.filter(community_id=community).order_by('-id')
        context = {
            'community': community,
            'community_file': list(community.communityfile_set.all())
        }
        print(context.get('community_file'))
        return render(request,'mypage/main-high.html',context)


class DeleteProfileView(View):
    def post(self, request):
        new_profile_path = 'member/2024/03/10/default.jpg'
        member = request.session['member']['id']

        print('삭제기능 들어옴')
        request.session['member_files'] = new_profile_path

        try:
            profile = MemberFile.objects.get(member_id=member)
            print(profile)

            profile = MemberFile.objects.filter(member_id=member).update(path=new_profile_path)
            profile.save()
            print('프로필 업데이트 성공')
        except MemberFile.DoesNotExist:
            print('프로필이 존재하지 않습니다.')

        return JsonResponse({'message': '프로필 이미지가 업데이트되었습니다.'})


class MyPagePointView(View):
    def get(self, request):
        member_id = request.session['member']['id']
        university = University.objects.filter(member_id=member_id).first()
        school = School.objects.filter(member_id=member_id).first()

        try:
            # 충전한 포인트 내역 최신순
            charge_date = Point.objects.filter(member_id=member_id, point_status=1).order_by('-id')

            # 사용한 포인트 내역 최신순
            use_date = Point.objects.filter(member_id=member_id, point_status=2).order_by('-id')

            # 적립한 포인트 내역 최신순
            get_date = Point.objects.filter(member_id=member_id, point_status=3).order_by('-id')

            date = use_date.first()
            dates = charge_date.first()
            datess = get_date.first()


            if university:  # 대학생인 경우
                member = request.session['member']['id']
                get_points = Point.objects.filter(member_id=member, point_status=1).aggregate(Sum('point'))['point__sum'] or 0
                get_point = University.objects.get(member_id=member_id)
                use_points = Point.objects.filter(member_id=member, point_status=2).aggregate(Sum('point'))['point__sum'] or 0
                point1 = Point.objects.filter(member_id=member, point_status=3).aggregate(Sum('point'))['point__sum'] or 0
                current_point = University.objects.filter(member_id=member).update(university_member_points=get_points-use_points+point1)
                real_point = University.objects.get(member_id=member).university_member_points
                use_point = use_date.aggregate(Sum('point'))['point__sum'] or 0  # 사용한 포인트 합계
                context = {
                    'point1': point1,
                    'point': get_points,
                    'current_point': real_point,
                    'use_point': use_point,
                    'charge_point': charge_date.aggregate(Sum('point'))['point__sum'] or 0,  # 충전한 포인트 합계
                    'use_time': date.updated_date if date else "없음",  # 최근 사용한 시간
                    'get_time': datess.updated_date if datess else '적립내역 없음',
                    'charge_time': dates.updated_date if dates else '충전내역 없음',  # 최근 충전한 시간
                }
                return render(request, 'mypage/point.html', context)

            elif school:  # 학교 회원인 경우
                member = request.session['member']['id']
                get_point = School.objects.get(member_id=member)
                current_point1 = Point.objects.filter(member_id=member, point_status=3).aggregate(Sum('point'))['point__sum']
                context = {
                    'datess' : datess,
                    'current_point1' : current_point1,
                    'use_time' : datess.updated_date if datess else "적립내역 없음",

                }
                return render(request,'mypage/school-point.html', context)
            else:
                # 처리할 수 있는 회원 타입이 아닌 경우
                raise ObjectDoesNotExist

        except ObjectDoesNotExist:
            return redirect('myPage:main')

    def post(self,request):
        member_id = request.session['member']['id']
        point = Point.objects.filter(member_id=member_id)
        request.session['point'] = PointSerializer(point.first()).data
        return redirect(request,'mypage:my_point')



        # member_id = request.session['member']['id']
        # university = University.objects.filter(member_id=member_id)
        # highschool = HighSchool.objects.filter(member_id=member_id)
        #
        # # 페이지 번호 가져오기
        # page = request.GET.get('page',1)
        #
        # # 작성 리스트 가져온다.
        # write_list = Community.objects.filter(member_id=member_id, community_status=0).order_by('-id')[:]
        # # write_files = CommunityFile.objects.filter(community_id=write_list).order_by('-id')
        #
        # # Paginator를 사용하여 페이지당 원하는 개수로 나누기
        # paginator = Paginator(write_list,8) # 8개씩 보여주기로 설정 (원하는 개수로 변경 가능)
        #
        # try:
        #     communities = paginator.page(page)
        # except EmptyPage:
        #     communities = paginator.page(paginator.num_pages)

        # context = {
        #     'members' : request.session['member'],
        #     'member_id' : member_id,
        #     'communities' : communities
        # }
        # if university :
        #     return render(request,'mypage/main-university.html',context)
        # elif highschool :
        #     return render(request,'mypage/main-high.html',context)
        # else :
        #     return render(request,'mypage/main.html',context)

class MemberLogoutView(View):
    def get(self, request):
        request.session.clear()
        return redirect('/')


class OneLabMembersAPI(View):
    def get(self, request):
        # 해당 University와 OneLab 정보 가져오기
        university = University.objects.get(member_id=request.session['member']['id'])
        onelabs = OneLab.objects.filter(university=university)

        onelab_info = []
        for onelab in onelabs:
            members_info = []
            members = OneLabMember.objects.filter(onelab=onelab, onelab_member_status=1).select_related(
                'university__member')
            for member in members:
                member_info = {
                    'member_id': member.university.member.id,
                    'member_email': member.university.member.member_email,
                    'member_name': member.university.member.member_name,
                    'member_major': member.university.university_member_major,
                    'member_points': member.university.university_member_points,
                    'onelab_member_status': member.onelab_member_status
                }
                members_info.append(member_info)

            onelab_info.append({
                'onelab_id': onelab.id,
                'members': members_info
            })

        return JsonResponse(onelab_info, safe=False)


def delete_members(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        selected_items = data.get("selected_items")
        print(selected_items)
        print(selected_items)
        # 선택된 항목들의 상태를 3으로 변경하는 코드를 작성
        for item_id in selected_items:
            try :
                OneLabMember.objects.filter(university__member__member_email=item_id).update(onelab_member_status=3)
                print('성공!')
            except :
                pass # 항목이 존재하지 않는 경우 무시

        return JsonResponse({'message': '선택된 회원이 성공적으로 탈퇴 되었습니다.'})
    return JsonResponse({'message': 'POST 요청이 필요합니다.'}, status=400)

def delete_onelab(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            selected_item = data.get('selectedName')
            onelab = OneLab.objects.get(onelab_main_title=selected_item)
            member_id = request.session['member']['id']

            # 해당 사용자가 해당 OneLab에 속한 멤버인지 확인
            onelab_member = OneLabMember.objects.get(university_id=member_id, onelab_id=onelab.id)

            # 멤버 상태를 탈퇴(3)로 변경
            onelab_member.onelab_member_status = 3
            onelab_member.save()

            return JsonResponse({'message': '선택된 항목이 성공적으로 탈퇴되었습니다.'})
        except ObjectDoesNotExist:
            return JsonResponse({'error': '해당 항목이 존재하지 않거나 권한이 없습니다.'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'POST 요청이 필요합니다'}, status=400)

def delete_all(request):
    if request.method == 'POST':
        # OneLab 모델에서 해당하는 객체 가져오기
        try:
            data = json.loads(request.body.decode('utf-8'))
            onelabId = data.get('id')
            print(onelabId)
            print('아이디를 못받아옴 ',onelabId)
            onelab = OneLab.objects.filter(id=onelabId).first()  # 해당하는 원랩 객체 가져오기
            if onelab:
                # onelab_post_status 값을 False로 변경
                onelab.onelab_post_status = False
                onelab.save()
                return JsonResponse({'message': '원랩이 성공적으로 종료되었습니다.'})
            else:
                return JsonResponse({'message': '원랩을 찾을 수 없습니다.'}, status=404)

        except:
            return JsonResponse({'message': 'POST 요청이 필요합니다.'}, status=400)