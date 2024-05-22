import math
import os
import ssl
from pathlib import Path
from urllib import request

import joblib
import numpy as np
import requests
from django.core.paginator import Paginator, EmptyPage
from django.http import JsonResponse
from sklearn.metrics.pairwise import cosine_similarity
from rest_framework.test import  APIRequestFactory
from ai.views import GetRecommendationsAPIView
from community.models import Community
from django.utils import timezone
from exhibition.models import Exhibition
from django.db.models import Q, Sum
from member.models import MemberFile, Member
from member.serializers import MemberSerializer
from onelab.models import OneLab
from place.models import Place
from school.models import School
from django.shortcuts import render
from django.views import View
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
import os.path
from pathlib import Path
import joblib
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from onelab.models import OneLab
from member.models import Member
from tag.models import Tag


from share.models import Share
from visitRecord.models import VisitRecord

ssl._create_default_https_context = ssl._create_unverified_context

from django.shortcuts import render, redirect
from django.views import View
from rest_framework.response import Response

from django.shortcuts import render
from django.views import View
from django.utils import timezone
from onelab.models import OneLab
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import joblib
from pathlib import Path
import os

# views.py

import math
import os
import ssl
from pathlib import Path
import joblib
import numpy as np
from django.shortcuts import render
from django.views import View
from django.utils import timezone
from onelab.models import OneLab
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from visitRecord.models import VisitRecord

ssl._create_default_https_context = ssl._create_unverified_context



from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pathlib import Path
import joblib
import os

import random
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pathlib import Path
import joblib
import os

from django.shortcuts import render
from django.views import View

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from pathlib import Path
import numpy as np
import random
import os




from django.shortcuts import render
from django.views import View
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status


class MainView(View):
    def get(self, request):
        member_id = request.session.get('member', {}).get('id')
        if member_id is None:
            print('회원 ID 없음')
            recommended_onelabs = []
        else:
            # REST API를 통해 추천 원랩 가져오기
            api_view = GetRecommendationsAPIView.as_view()
            factory = APIRequestFactory()
            api_request = factory.get('/api/recommendations/', {'member_id': member_id})
            api_response = api_view(api_request)
            if api_response.status_code == 200:
                recommended_onelabs = api_response.data['recommended_onelabs']
            else:
                recommended_onelabs = []

        # 장소 정보 가져오기
        places = Place.objects.all()
        place_info = {
            'places': []
        }
        for place in places:
            place_files = list(place.placefile_set.values('path'))
            place_info['places'].append({
                'files': place_files,
                'place_title': place.place_title,
                'place_address': place.school.school_member_address,
                'place_points': place.place_points,
                'place_date': place.place_date,
                'place_id': place.id,
                'school_name': place.school.school_name,
                'created_date': place.created_date,
            })

        # 전시 정보 가져오기
        exhibitions = Exhibition.objects.all()
        exhibition_info = {
            'exhibitions': []
        }
        for exhibition in exhibitions:
            exhibition_files = list(exhibition.exhibitionfile_set.values('path'))
            exhibition_info['exhibitions'].append({
                'files': exhibition_files,
                'exhibition_title': exhibition.exhibition_title,
                'exhibition_content': exhibition.exhibition_content,
                'exhibition_status': exhibition.exhibition_status,
            })

        # 공유 정보 가져오기
        shares = Share.objects.all()
        share_info = {
            'shares': []
        }
        for share in shares:
            share_files = list(share.sharefile_set.values('path'))
            share_info['shares'].append({
                'files': share_files,
                'id': share.id,
                'share_title': share.share_title,
                'share_content': share.share_content,
                'share_points': share.share_points,
                'share_choice_major': share.share_choice_grade,
                'share_type': share.share_type,
                'share_text_major': share.share_text_major,
                'share_text_name': share.share_text_name,
                'share_choice_grade': share.share_choice_grade,
            })

        # 커뮤니티 정보 가져오기
        communities = Community.objects.all()
        communities_info = {
            'communities': []
        }
        for community in communities:
            community_files = list(community.files.values('path'))
            communities_info['communities'].append({
                'files': community_files,
                'id': community.id,
                'community_title': community.community_title,
                'community_content': community.community_content,
                'post_status': community.post_status,
                'status': community.status
            })

        # 방문자 기록
        visit_record, created = VisitRecord.objects.get_or_create(date=timezone.now().date())
        if created:
            visit_record.count = 1
        else:
            visit_record.count += 1
        visit_record.save()

        # 멤버 정보 가져오기
        member_id = request.session.get('member', {}).get('id')
        default_profile_url = 'https://static.wadiz.kr/assets/icon/profile-icon-1.png'

        if member_id is None:
            profile = default_profile_url
            context = {
                'places': place_info['places'],
                'exhibitions': exhibition_info['exhibitions'],
                'shares': share_info['shares'],
                'onelabs': recommended_onelabs,
                'communities': communities_info['communities'],
                'profile': profile,
            }
            return render(request, 'main/main-page.html', context)
        else:
            request.session['member_name'] = MemberSerializer(Member.objects.get(id=member_id)).data
            profile = MemberFile.objects.filter(member_id=member_id).first()
            if profile is not None:
                context = {
                    'places': place_info['places'],
                    'exhibitions': exhibition_info['exhibitions'],
                    'shares': share_info['shares'],
                    'onelabs': recommended_onelabs,
                    'communities': communities_info['communities'],
                    'profile': profile,
                }
                return render(request, 'main/main-page.html', context)
            else:
                profile = default_profile_url
                context = {
                    'places': place_info['places'],
                    'exhibitions': exhibition_info['exhibitions'],
                    'shares': share_info['shares'],
                    'onelabs': recommended_onelabs,
                    'communities': communities_info['communities'],
                    'profile': profile,
                }
                return render(request, 'main/main-page.html', context)

    def post(self, request):
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            member_id = request.session.get('member', {}).get('id')
            if member_id is None:
                return JsonResponse({'error': '회원 ID 없음'}, status=400)

            current_index = int(request.POST.get('current_index', 0))
            num_recommendations = int(request.POST.get('num_recommendations', 4))

            # Get the complete list of recommendations
            member_tag = Member.objects.get(id=member_id).tag.tag_name
            api_view = GetRecommendationsAPIView.as_view()
            factory = APIRequestFactory()
            api_request = factory.get('/api/recommendations/', {'member_tag': member_tag})
            api_response = api_view(api_request)

            if api_response.status_code == 200:
                all_recommended_onelabs = api_response.data['recommended_onelabs']
                new_recommended_onelabs = all_recommended_onelabs[current_index:current_index + num_recommendations]
                return JsonResponse({'recommended_onelabs': new_recommended_onelabs}, status=200)
            return JsonResponse({'error': '추천 원랩을 가져오는데 실패했습니다.'}, status=500)
        else:
            pass