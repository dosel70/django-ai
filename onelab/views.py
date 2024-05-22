import os

import joblib
import numpy as np
from django.db import transaction
from django.shortcuts import render, redirect
from django.utils import timezone
from django.views import View
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from sklearn.metrics.pairwise import cosine_similarity

from file.models import File
from member.models import Member, MemberFile
from onelab.models import OneLab, OneLabFile, OneLabBannerFile
from onelabMember.models import OneLabMember
from university.models import University


class OnelabWriteView(View):
    def get(self, request):
        member = Member(**request.session['member'])
        university = University.objects.get(member=member)
        profile = MemberFile.objects.filter(member=member).first()

        context = {
            'member': member,
            'university': university,
            'profile': profile,
        }

        default_profile_url = 'https://static.wadiz.kr/assets/icon/profile-icon-1.png'

        if profile is None:
            profile = default_profile_url

        return render(request, "onelab/one-lab-write.html", context)

    @transaction.atomic
    def post(self, request):
        data = request.POST
        files = request.FILES.get('file-img')
        files_banner = request.FILES.get('file-banner')
        data = {
            "onelab_main_title": data['onelab-main-title'],
            "onelab_content": data['onelab-content'],
            "onelab_detail_content": data['onelab-detail-content'],
            "onelab_max_count": data['onelab-max-count'],
            "onelab_ask_email": data['onelab-ask-email'],
            "onelab_url": data['onelab-url'],
            "university": University.objects.get(member_id=request.session['member']['id'])
        }


        onelab = OneLab.objects.create(**data)

        if files is not None:
            file_instance = File.objects.create(file_size=files.size)
            OneLabFile.objects.create(onelab=onelab, file=file_instance, path=files)

        if files_banner is not None:
            file_instance = File.objects.create(file_size=files.size)
            OneLabBannerFile.objects.create(onelab=onelab, file=file_instance, path=files_banner)

        return redirect(onelab.get_absolute_url())

class OnelabDetailView(View):
    def get(self, request):
        onelab = OneLab.objects.get(id=request.GET.get('id'))
        onelab.updated_date = timezone.now()
        # members = list(onelab.onelabmember_set.all())
        members = OneLabMember.objects.filter(onelab=onelab)
        onelab_file = OneLabFile.objects.filter(onelab=onelab)
        onelab_banner_file = OneLabBannerFile.objects.filter(onelab=onelab)
        # print(members)

        # context = {
        #     'community': community,
        #     'community_file': CommunityFile.objects.filter(community=community),
        #     'profile': profile
        # }
        # 랩원
        return render(request, "onelab/one-lab-detail.html", {"onelab": onelab, "members": members, "onelab_file":onelab_file, "onelab_banner_file":onelab_banner_file})

    def post(self, request):
        data = request.POST
        member_id = request.session['member']['id']
        real_member = University.objects.get(member_id=member_id)
        onelab_id = int(data.get('onelab_id'))  # 문자열을 숫자로 변환
        print(onelab_id)

        datas = {
            'onelab_member_status': 1,
            'university_id': real_member.member_id,
            'onelab_id': onelab_id
        }
        if real_member.member_id == onelab_id:
            pass
        OneLabMember.objects.create(**datas)
        return redirect('onelab:list')

class OnelabListView(View):
    def get(self, request):
        onelabs = OneLab.enabled_objects.filter(onelab_post_status=True).order_by('-id')
        total_onelabs = onelabs.count()
        member_id = request.session['member']['id']

        for onelab in onelabs:
            onelab_member_count = OneLabMember.objects.filter(onelab_id=onelab.id, onelab_member_status=1).count()
            setattr(onelab, 'one_lab_member_count', onelab_member_count)

        context = {
            'member': request.session['member'],
            'onelab': onelabs,
            'total': total_onelabs,
        }

        return render(request, 'onelab/one-lab-list.html', context)

    def post(self, request):
        pass



class AiAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        datas = request.data
        datas = np.array(list(datas.values())).astype('float16')
        from pathlib import Path
        model_path = os.path.join(Path(__file__).resolve().parent, 'test_onelab.pkl')

        # 모델 로드
        model = joblib.load(model_path)

        # 예측 확률 계산
        probabilities_df = self.predict_probabilities(model, datas)

        # 확률이 높은 두 개의 태그를 선택
        top_two_indices = probabilities_df.sum().argsort()[::-1][:2]

        # 회원의 정보와 태그를 기반으로 추천 원랩 계산
        member = Member.objects.get(member_email=request.user.email)
        top_onelabs = self.get_top_n_similar_onelabs(member, top_two_indices, n=2)

        # 결과 반환
        result = {
            'recommended_onelabs': [onelab.onelab_main_title for onelab in top_onelabs]
        }
        from requests import Response
        return Response(result)

    def predict_probabilities(self, model, X):
        probas = model.predict_proba([X])
        probas_rounded = np.round(probas, 2)
        probas_rounded_str = np.vectorize(lambda x: format(float(x), '.2f'))(probas_rounded)
        import pandas as pd
        return pd.DataFrame(probas_rounded_str, columns=model.classes_)

    def get_top_n_similar_onelabs(self, member, top_two_indices, n=2):
        # 회원의 관심사 태그를 가져옵니다.
        member_tag = member.objects.get(tag__member=member)
        # 원랩의 태그를 가져옵니다.
        onelabs = OneLab.objects.get(tag__member=member)

        # 회원 태그와 원랩 태그를 비교하기 위한 배열을 만듭니다.
        member_vector = np.zeros(4)
        member_vector[member_tag] = 1

        onelab_vectors = []
        for onelab in onelabs:
            onelab_vector = np.zeros(4)
            onelab_vector[onelab.tag.tag_name] = 1
            onelab_vectors.append((onelab, onelab_vector))

        # 코사인 유사도를 계산합니다.
        similarities = []
        for onelab, onelab_vector in onelab_vectors:
            similarity = cosine_similarity([member_vector], [onelab_vector])[0][0]
            similarities.append((onelab, similarity))

        # 유사도가 높은 순서대로 정렬합니다.
        similarities = sorted(similarities, key=lambda x: x[1], reverse=True)

        # 상위 n개의 원랩을 반환합니다.
        top_n_onelabs = [onelab for onelab, _ in similarities[:n]]
        return top_n_onelabs
