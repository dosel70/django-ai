from django.http import JsonResponse
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

class MainView(View):
    def get(self, request):
        return render(request, 'main/main-page.html')

class GetRecommendationsAPIView(APIView):
    def get_index_from_member_tag(self, member_tag):
        model_path = os.path.join(Path(__file__).resolve().parent, 'test_onelab.pkl')
        with open(model_path, 'rb') as f:
            model = joblib.load(f)
            print(f'피클 잘 불러옴: {model}')

        onelabs = list(OneLab.objects.filter(tag__tag_name=member_tag))
        onelabs_list = [f"{onelab.onelab_main_title} {onelab.onelab_content} {onelab.onelab_detail_content}" for onelab in onelabs]
        vectorizer = CountVectorizer()
        content_vectors = vectorizer.fit_transform(onelabs_list)
        similarity_matrix = cosine_similarity(content_vectors)
        mean_similarity_scores = np.mean(similarity_matrix, axis=1)

        print(f'평균 유사도 점수 : {mean_similarity_scores}')

        max_similarity_index = np.argmax(mean_similarity_scores)
        print(f'가장 높은 평균 유사도 점수를 가진 OneLab 객체의 인덱스 : {max_similarity_index}')
        return max_similarity_index, content_vectors

    def recommend_similar_onelabs(self, member_tag, content_vectors, start_index, num_recommendations=3):
        max_similarity_index, _ = self.get_index_from_member_tag(member_tag)
        similarity_scores = cosine_similarity(content_vectors[max_similarity_index], content_vectors)
        similar_onelab_indices = similarity_scores.argsort()[0]
        print(f'유사도가 높은 순으로 정렬된 인덱스 배열 {similar_onelab_indices}')
        recommended_onelabs = []
        count = 0
        for idx in similar_onelab_indices[::-1]:
            if count >= start_index and len(recommended_onelabs) < num_recommendations:
                if idx != max_similarity_index:
                    recommended_onelabs.append(OneLab.objects.get(id=idx))
            count += 1

        return recommended_onelabs

    def get_member_recommendations(self, member_id):
        member = Member.objects.get(id=member_id)
        member_tag = member.tag.tag_name if member.tag else None
        max_similarity_index, content_vectors = self.get_index_from_member_tag(member_tag)
        onelab_tag = OneLab.objects.filter(tag__tag_name=member_tag)
        recommended_onelabs = self.recommend_similar_onelabs(member_tag, content_vectors, 0)
        random_onelab = random.choice(onelab_tag)
        recommended_onelabs.append(random_onelab)
        return recommended_onelabs

    def post(self, request):
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            member_id = request.session.get('member', {}).get('id')
            if member_id is None:
                return JsonResponse({'error': '회원 ID 없음'}, status=400)

            current_index = int(request.POST.get('current_index', 0))
            num_recommendations = int(request.POST.get('num_recommendations', 3))

            # Get the member tag and content vectors
            member = Member.objects.get(id=member_id)
            member_tag = member.tag.tag_name if member.tag else None

            # Load the content vectors
            max_similarity_index, content_vectors = self.get_index_from_member_tag(member_tag)

            # Get recommendations
            recommended_onelabs = self.recommend_similar_onelabs(member_tag, content_vectors, current_index, num_recommendations)

            if recommended_onelabs:
                onelab_info = []
                for onelab in recommended_onelabs:
                    onelab_files = [file.path for file in onelab.onelabfile_set.all()]
                    onelab_info.append({
                        'files': onelab_files,
                        'onelab_main_title': onelab.onelab_main_title,
                        'onelab_content': onelab.onelab_content,
                        'get_absolute_url': onelab.get_absolute_url()
                    })
                return JsonResponse({'recommended_onelabs': onelab_info}, status=200)
            return JsonResponse({'error': '추천 원랩을 가져오는데 실패했습니다.'}, status=500)
        else:
            return JsonResponse({'error': 'Invalid request'}, status=400)

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
                print(f'피클 잘 불러옴: {model}')

            predictions = model.predict(datas.reshape(-1, 4))
            probabilities = model.predict_proba(datas.reshape(-1, 4))

            print(f'{predictions}')
            print(f'{probabilities}')

            return Response({
                'predictions': predictions.tolist(),
                'probabilities': probabilities.tolist()
            })
