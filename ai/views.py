from django.shortcuts import render
from django.views import View
from rest_framework.views import APIView
from rest_framework.response import Response
import os.path
from pathlib import Path
import joblib
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from onelab.models import OneLab
from member.models import Member
import random

# class AiView(View):
#     def get(self, request):
#         print("아하하하하하하하ㅏ하ㅏ AI다!!!!!")
#         return render(request, 'main/main-page.html')

class GetRecommendationsAPIView(APIView):
    def get_index_from_member_tag(self, member_tag):

        # 주어진 회원 태그에 해당하는 OneLab 객체들을 데이터베이스에서 가져온다.
        onelabs = list(OneLab.objects.filter(tag__tag_name=member_tag))

        # 각 OneLab 객체의 제목, 내용 및 상세 내용을 합쳐 텍스트 데이터 리스트를 생성한다.
        onelabs_list = [f"{onelab.onelab_main_title} {onelab.onelab_content} {onelab.onelab_detail_content}" for onelab
                        in onelabs]

        # CountVectorizer를 사용하여 원랩 데이터를 벡터화.
        vectorizer = CountVectorizer()
        content_vectors = vectorizer.fit_transform(onelabs_list)

        # 코사인 유사도 행렬을 계산.
        similarity_matrix = cosine_similarity(content_vectors)

        # 각 OneLab 객체의 평균 유사도 점수를 계산
        mean_similarity_scores = np.mean(similarity_matrix, axis=1)

        # 가장 높은 평균 유사도 점수를 가진 OneLab 객체의 인덱스를 찾음
        max_similarity_index = np.argmax(mean_similarity_scores)
        print(f'가장 높은 평균 유사도 점수를 가진 OneLab 객체의 인덱스 : {max_similarity_index}')

        # 가장 유사한 OneLab 객체의 인덱스와 벡터를 반환.
        return max_similarity_index, content_vectors

    def recommend_similar_onelabs(self, member_tag, content_vectors, num_recommendations=3):
        # 주어진 회원 태그에 대해 가장 유사한 OneLab 객체의 인덱스를 가져옴
        max_similarity_index, _ = self.get_index_from_member_tag(member_tag)

        # 선택된 OneLab 객체와 다른 OneLab 객체들 간의 유사도 점수를 계산
        similarity_scores = cosine_similarity(content_vectors[max_similarity_index], content_vectors)

        # 유사도가 높은 순으로 정렬된 OneLab 객체의 인덱스 배열을 가져옴
        similar_onelab_indices = similarity_scores.argsort()[0]
        print(f'유사도가 높은 순으로 정렬된 인덱스 배열 {similar_onelab_indices}')

        # 추천할 OneLab 객체들을 저장할 리스트를 초기화
        recommended_onelabs = []

        # 유사도가 높은 순으로 OneLab 객체를 반복하면서 추천 목록을 구성
        for idx in similar_onelab_indices[::-1]:
            # 추천 목록의 길이가 지정된 추천 개수에 도달하면 반복을 종료
            if len(recommended_onelabs) == num_recommendations:
                break

            # 가장 유사한 OneLab 객체는 제외하고 다른 유사한 OneLab 객체를 추천 목록에 추가
            if idx != max_similarity_index:
                recommended_onelabs.append(OneLab.objects.get(id=idx))

        # 남은 추천 개수를 계산
        remaining_recommendations = num_recommendations - len(recommended_onelabs)

        # 남은 추천 개수만큼 무작위로 선택된 OneLab 객체를 추천 목록에 추가
        remaining_onelabs = list(
            OneLab.objects.exclude(id=max_similarity_index)
            .exclude(id__in=[onelab.id for onelab in recommended_onelabs])
            .order_by('?')[:remaining_recommendations]
        )
        recommended_onelabs.extend(remaining_onelabs)

        # 최종 추천 목록을 반환
        return recommended_onelabs

    def get_member_recommendations(self, member_id):
        member = Member.objects.get(id=member_id)
        member_tag = member.tag.tag_name if member.tag else None
        max_similarity_index, content_vectors = self.get_index_from_member_tag(member_tag)
        onelab_tag = OneLab.objects.filter(tag__tag_name=member_tag)
        recommended_onelabs = self.recommend_similar_onelabs(member_tag, content_vectors)
        random_onelab = random.choice(onelab_tag)
        recommended_onelabs.append(random_onelab)
        return recommended_onelabs

    def post(self, request):
        member_id = request.data.get('member_id')
        if not member_id:
            return Response({'error': 'Member ID is required'}, status=400)

        try:
            recommended_onelabs = self.get_member_recommendations(member_id)
        except Member.DoesNotExist:
            return Response({'error': 'Member not found'}, status=404)

        onelab_info = []
        for onelab in recommended_onelabs:
            onelab_files = [file.path for file in onelab.onelabfile_set.all()]
            onelab_info.append({
                'files': onelab_files,
                'onelab_main_title': onelab.onelab_main_title,
                'onelab_content': onelab.onelab_content,
            })

        return Response({'recommended_onelabs': onelab_info}, status=200)

    def get(self, request):
        member_id = request.query_params.get('member_id')
        if not member_id:
            return Response({'error': 'Member ID is required'}, status=400)

        try:
            recommended_onelabs = self.get_member_recommendations(member_id)
        except Member.DoesNotExist:
            return Response({'error': 'Member not found'}, status=404)

        onelab_info = []
        for onelab in recommended_onelabs:
            onelab_files = [file.path for file in onelab.onelabfile_set.all()]
            onelab_info.append({
                'files': onelab_files,
                'onelab_main_title': onelab.onelab_main_title,
                'onelab_content': onelab.onelab_content,
            })

        return Response({'recommended_onelabs': onelab_info}, status=200)

class PredictAPIView(APIView):
        def post(self, request):
            datas = request.data.get('features')
            if not datas:
                return Response({'error': 'Features data is required'}, status=400)

            datas = np.array(datas).astype('float16')
            model_path = os.path.join(Path(__file__).resolve().parent, 'test_onelab.pkl')
            with open(model_path, 'rb') as f:
                model = joblib.load(f)

            predictions = model.predict(datas.reshape(-1, 4))
            probabilities = model.predict_proba(datas.reshape(-1, 4))

            print(f'{predictions}')
            print(f'{probabilities}')

            return Response({
                'predictions': predictions.tolist(),
                'probabilities': probabilities.tolist()
            })