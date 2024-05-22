from django.db.models import F
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView

from member.models import Member
from reply.models import Reply


class ReplyWriteAPI(APIView):
    def post(self, request):
        data = request.data

        data = {
            'reply_content': data['reply_content'],
            'community_id': data['community_id'],
            'member_id': request.session['member']['id']
        }

        Reply.objects.create(**data)
        return Response('success')


class ReplyListAPI(APIView):
    def get(self, request, community_id, page):
        row_count = 5
        offset = (page - 1) * row_count
        limit = page * row_count

        replies = Reply.objects.filter(community_id=community_id)\
            .annotate(member_name=F('member__member_name'))\
            .values('reply_content', 'id', 'member_name', 'created_date', 'member_id')

        return Response(replies[offset:limit])

class ReplyAPI(APIView):
    def delete(self, request, reply_id):
        Reply.objects.filter(id=reply_id).delete()
        return Response('success')

    def patch(self, request, reply_id):
        reply_content = request.data['reply_content']
        updated_date = timezone.now()

        reply = Reply.objects.get(id=reply_id)
        reply.reply_content = reply_content
        reply.updated_date = updated_date
        reply.save(update_fields=['reply_content', 'updated_date'])

        return Response('success')
