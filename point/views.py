from django.core.paginator import Paginator, EmptyPage
from django.db.models import Q, Sum
from django.http import JsonResponse, HttpResponse, HttpResponseNotFound
from django.shortcuts import render, redirect
from django.views import View
from rest_framework.response import Response
from rest_framework.utils import json
from rest_framework.views import APIView
import math

from member.models import Member
from place.models import PlacePoints, Place
from placeMember.models import PlaceMember
from point.models import Point
from school.models import School
from share.models import Share, SharePoints
from shareMember.models import ShareMember
from university.models import University


class PointView(View):
    def get(self, request):
        member = request.session['member']
        member_id = request.session['member']['id']
        point_total = Point.objects.filter(member_id=member_id, point_status=1).aggregate(Sum('point'))['point__sum']
        use_total = Point.objects.filter(member_id=member_id , point_status=2).aggregate(Sum('point'))['point__sum']
        # total = point_total - use_total
        # if use_total is None :
        #     university = University.objects.filter(member_id=member_id).update(university_member_points=point_total)
        # elif total < 0 :
        #     university = University.objects.filter(member_id=member_id).update(university_member_points=0)
        # else :
        #     university = University.objects.filter(member_id=member_id).update(university_member_points=total)

        # print(university)

        print(member_id)
        context = {
            'member': member
        }
        print('GET 들어옴')
        return render(request, 'point/point-charge.html', context)

    def post(self, request):
        # fetch의 json 형태의 body 정보를 문자열로 디코딩함 (utf-8)
        data = json.loads(request.body.decode('utf-8'))
        point = data.get('point')
        member_id = request.session['member']['id']
        datas = {
            'point': point,
            'member_id': member_id,
            'point_status': 1  # 충전 상태
        }
        university = University.objects.filter(member_id=member_id).first()
        if university:
            point_obj = Point.objects.create(**datas)
            print(f'충전된 금액 -> {point}point')

            # 대학생 포인트에 추가
            university.university_member_points += point_obj.point
            university.save()

            return JsonResponse({'success': True, 'message': '성공!!'})
        else:
            return JsonResponse({'success': False, 'message': '대학생만 충전이 가능합니다'})

class PointChargeView(View):
    def post(self, request):
        if request.method == 'POST':
            data = request.POST
            member_name = request.session['member']
            member = request.session['member']['id']

            price = data['point-number']
            data = {
                'point': price,
                'member_id': member,
                'point_status': 2
            }

            Point.objects.create(**data)
            # University.objects.filter(member_id=member).update(Sum(university_member_points = price))

            context = {
                'member': member_name
            }
            return render(request, 'point/point-pull.html', context)


class PointDetailView(View):
    def get(self, request):
        member = request.session['member']
        member_id = request.session['member']['id']
        point_value = request.GET.get('point', 0)
        university = University.objects.filter(member_id=member_id)
        # member_id = request.GET.get('member_id')
        # point_value = request.GET.get('point')

        context = {
            'university': university,
            'member': member,
            'member_id': member_id,
            'point_value': point_value,
        }
        print('api 화면 들어옴')
        return render(request, 'point/point-api.html', context)
    def post(self,request):
        data = request.POST
        print('세션 값도 받아옴 성공')

        data = {
            'member_id': data['member_id'],
            'point' : data['point_value'],
            'status' : 2
        }

        # point= Point.objects.filter(id=request.POST.get('member_id'))
        point = Point.objects.filter(id=request.session['member']['id'])
        print(point)

        if point.exists():
            del data['point_value']
            from django.utils import timezone
            data['updated_date'] = timezone.now()
            point.update(**data)
        else:
            member = Point.objects.create(**data)

        print("api 뷰로 이동")
        return redirect('point:detaillist')


# 포인트 충전 내역 View----------------------------------
class PointListView(View):
    def get(self, request):
        member_id = request.session['member']['id']

        # 페이지 번호 가져오기
        page = request.GET.get('page', 1)

        # 포인트 리스트 가져오기
        point_list = Point.objects.filter(member_id=member_id, point_status=1).order_by('-id')

        # Paginator를 사용하여 페이지당 원하는 개수로 나누기
        paginator = Paginator(point_list, 8)  # 8개씩 보여주기로 설정 (원하는 개수로 변경 가능)

        try:
            points = paginator.page(page)
        except EmptyPage:
            points = paginator.page(paginator.num_pages)

        context = {
            'member': request.session['member'],
            'member_id': member_id,
            'points': points,
        }

        return render(request, 'point/pay-list.html', context)


class PointListAPI(APIView):
    def get(self, request):
        page = request.GET.get('page', 1)
        type = request.GET.get('type', '')
        keyword = request.GET.get('keyword', '')
        order = request.GET.get('order', 'recent')
        page = int(request.GET.get('page', 1))

        condition = Q()
        if type:
            for t in list(type):
                if t == 't':
                    condition |= Q(post_title__contains=keyword)

                elif t == 'c':
                    condition |= Q(post_content__contains=keyword)

                elif t == 'w':
                    condition |= Q(member__member_name__contains=keyword)

        row_count = 5
        offset = (page - 1) * row_count
        limit = page * row_count
        total = Point.enabled_objects.filter(condition).count()
        page_count = 5

        end_page = math.ceil(page / page_count) * page_count
        start_page = end_page - page_count + 1
        real_end = math.ceil(total / row_count)
        end_page = real_end if end_page > real_end else end_page

        if end_page == 0:
            end_page = 1

        context = {
            'total': total,
            'order': order,
            'start_page': start_page,
            'end_page': end_page,
            'page': page,
            'real_end': real_end,
            'page_count': page_count,
            'type': type,
            'keyword': keyword,
        }
        ordering = '-id'
        if order == 'popular':
            ordering = '-id'

        context['points'] = list(Point.enabled_objects.filter(condition).order_by(ordering))[offset:limit]

        return render(request, 'point/pay-list.html', context)


class PointListDetailView(View):
    def get(self, request):
        member = request.session['member']
        member_id = request.session['member']['id']

        point_id = request.GET.get('id')
        point = Point.objects.get(id=point_id, member_id=member_id)

        context = {
            'date': Point.objects.filter(member_id=member_id).values('updated_date').first(),
            'member': member,
            'member_id': member_id,
            'point': point,
        }
        return render(request, 'point/pay-list-detail.html', context)

# ------------------------------------------------------------------------------
    # 포인트 사용 View
class PointUseListView(View):
    def get(self, request):
        member_id = request.session['member']['id']

        # 페이지 번호 가져오기
        page = request.GET.get('page', 1)

        # 포인트 리스트 가져오기
        point_list = Point.objects.filter(member_id=member_id, point_status=2).order_by('-id')

        # Paginator를 사용하여 페이지당 원하는 개수로 나누기
        paginator = Paginator(point_list, 8)  # 8개씩 보여주기로 설정 (원하는 개수로 변경 가능)

        try:
            points = paginator.page(page)
        except EmptyPage:
            points = paginator.page(paginator.num_pages)

        context = {
            'member': request.session['member'],
            'member_id': member_id,
            'points': points,
        }

        return render(request, 'point/use-list.html', context)


class PointUseDetailView(View):

    def get(self, request):
        member = request.session['member']
        member_id = request.session['member']['id']
        point_id = request.GET.get('id')

        try:
            point = Point.objects.get(id=point_id, member_id=member_id)
        except Point.DoesNotExist:
            # Handle the case where the point does not exist
            return HttpResponseNotFound("Point does not exist")

        place_true = PlaceMember.objects.filter(university=member_id).first()
        print(place_true)
        share_true = ShareMember.objects.filter(university=member_id).first()
        print(share_true)

        context = {
            'date': point.updated_date,
            'member': member,
            'member_id': member_id,
            'point': point,
        }

        if place_true:
            place = Place.objects.get(id=place_true.place_id)
            context['place'] = place
            context['place_true'] = place_true
            context['place_title'] = place.place_title
            context['place_points'] = place.place_points

        if share_true:
            share = Share.objects.get(id=share_true.share_id)
            share_name = University.objects.get(member_id=share.university)
            sale_member = Member.objects.get(id=share_name.member_id)
            print(sale_member)
            context['share'] = share
            context['sale_member'] = sale_member
            context['share_true'] = share_true
            context['share_title'] = share.share_title
            context['share_points'] = share.share_points

        return render(request, 'point/use-list-detail.html', context)


#------------적립 내역 view-------------------------
class PointGetListView(View):
    def get(self, request):
        member_id = request.session['member']['id']

        # 페이지 번호 가져오기
        page = request.GET.get('page', 1)

        # 포인트 리스트 가져오기
        point_list = Point.objects.filter(member_id=member_id, point_status=3).order_by('-id')

        # Paginator를 사용하여 페이지당 원하는 개수로 나누기
        paginator = Paginator(point_list, 8)  # 8개씩 보여주기로 설정 (원하는 개수로 변경 가능)

        try:
            points = paginator.page(page)
        except EmptyPage:
            points = paginator.page(paginator.num_pages)

        context = {
            'member': request.session['member'],
            'member_id': member_id,
            'points': points,
        }

        return render(request, 'point/get-list.html', context)

class PointGetDetailView(View):
    def get(self, request):
        member = request.session['member']
        member_id = request.session['member']['id']
        point_id = request.GET.get('id')
        point = Point.objects.get(id=point_id, member_id=member_id)

        place_true = Place.objects.filter(school=member_id).first()
        share_true = Share.objects.filter(university=member_id).first()

        context = {
            'date': Point.objects.filter(member_id=member_id).values('updated_date').first(),
            'member': member,
            'member_id': member_id,
            'point': point,
            'school': School.objects.filter(member_id=member_id).values('school_name').first()
        }

        if place_true :
            place_id = Place.objects.filter(school=member_id).first()
            place_point = Point.objects.get(id=point_id)
            place_title = place_true.place_title
            place_points = place_true.place_points

            context['place'] = place_id
            context['place_true'] = place_true
            context['place_point'] = place_point
            context['place_points'] = place_points
            context['place_title'] = place_title

        if share_true :
            share_id = Share.objects.filter(university=member_id).first()
            share_point = Point.objects.get(id=point_id)
            share_title = share_true.share_title
            share_points = share_true.share_points

            context['share'] = share_id
            context['share_true'] = share_true
            context['share_points'] = share_point
            context['share_points'] = share_points
            context['share_title'] = share_title

        return render(request, 'point/get-list-detail.html', context)


    # def public(self,request):
    #     data = request.POST
    #     member = Member.objects.filter(id=1)
    #     data = {
    #         'member_id' : member,
    #         'point' : data['point']
    #     }
    #     points = Point.objects.create(**data)
    #     print(points)
    #     return redirect(Point.get_absolute_url)








