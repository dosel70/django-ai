from django.core.paginator import Paginator, EmptyPage
from django.db import transaction
from django.db.models import Q

from django.shortcuts import render, redirect
from django.utils import timezone
from django.views import View

from community.models import Community, CommunityFile
from file.models import File
from member.models import Member, MemberFile


class CommunityWriteView(View):
    def get(self, request):
        member = Member(**request.session['member'])
        profile = MemberFile.objects.filter(member=member).first()

        context = {
            'member': member,
            'profile': profile,
        }

        default_profile_url = 'https://static.wadiz.kr/assets/icon/profile-icon-1.png'

        if profile is None:
            profile = default_profile_url


        return render(request, 'community/community-write.html', context)

    @transaction.atomic
    def post(self, request):
        data = request.POST
        files = request.FILES.get('file')

        member = Member(**request.session['member'])
        categories = data.get('categories')

        data = {
            'member': member,
            'community_title': data['community-title'],
            'community_content': data['community-content'],
            'post_status': data['categories'],
            'member_file': MemberFile.objects.filter(member=member),
        }

        community = Community.objects.create(**data)

        if files is not None:
            file_instance = File.objects.create(file_size=files.size)
            community_file = CommunityFile.objects.create(community=community, file=file_instance, path=files)


        return redirect(community.get_absolute_url())



class CommunityDetailView(View):
    def get(self, request):
        community = Community.objects.get(id=request.GET['id'])
        community.update_date = timezone.now()
        member = Member(**request.session['member'])
        profile = MemberFile.objects.filter(member=member).first()


        context = {
            'community': community,
            'community_file': CommunityFile.objects.filter(community=community),
            'profile': profile,
        }

        default_profile_url = 'https://static.wadiz.kr/assets/icon/profile-icon-1.png'

        if profile is None:
            profile = default_profile_url

        return render(request, 'community/community-detail.html', context)



# 페이징 처리 완 CommunityList(View)
class CommunityListView(View):
    def get(self, request):
        member_id = request.session['member']['id']

        # 페이지 번호 가져오기
        page = request.GET.get('page', 1)
        # post_status를 GET 방식으로 가져오지만, default='all'
        post_status = request.GET.get('post_status', 'all')

        # 검색어 가져오기
        search_query = request.GET.get('q')

        # 커뮤니티 리스트 가져오기
        community = Community.objects.filter(status=True)

        if post_status != 'all':
            community = community.filter(post_status=post_status)

        if search_query:
            community = community.filter(
                Q(community_title__icontains=search_query) |  # 제목에 검색어가 포함된 경우
                Q(community_content__icontains=search_query) |  # 내용에 검색어가 포함된 경우
                Q(member__member_name__icontains=search_query)  # 작성자에 검색어가 포함된 경우
            )

        # Paginator를 사용하여 페이지당 원하는 개수로 나누기
        paginator = Paginator(community, 5)  # 5개씩 보여주기로 설정 (원하는 개수로 변경 가능)

        try:
            communities = paginator.page(page)
        except EmptyPage:
            communities = paginator.page(paginator.num_pages)

        context = {
            'member': request.session['member'],
            'member_id': member_id,
            'communities': communities,
            'post_status': post_status,
            'search_query': search_query,
        }

        return render(request, 'community/community-list.html', context)

class CommunityDeleteView(View):
    def get(self, request):
        community = Community.objects.get(id=request.GET['id'])
        community.status = False
        community.updated_date = timezone.now()
        community.save(update_fields=['status', 'updated_date'])

        return redirect('community:list')

class CommunityUpdateView(View):
    def get(self, request):
        community_id = request.GET.get('id')
        community = Community.objects.get(id=community_id)

        context = {
            'community': community,
        }
        return render(request, 'community/community-update.html', context)

    @transaction.atomic
    def post(self, request):
        community_id = request.GET.get('id')
        data = request.POST
        community = Community.objects.get(id=community_id)

        community.community_title = data.get('community-title')
        community.community_content = data.get('community-content')
        community.post_status = data.get('categories')

        community.save()

        return redirect(community.get_absolute_url())
