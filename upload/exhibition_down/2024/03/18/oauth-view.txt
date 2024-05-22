from allauth.socialaccount.models import SocialAccount
from django.views import View
from django.shortcuts import render, redirect

from member.models import Member
from member.serializers import MemberSerializer


class OAuthLoginView(View):
    def get(self, request):
        user = SocialAccount.objects.get(user=request.user)
        oauth_data = user.extra_data
        if user.provider == "kakao":
            member_email = oauth_data.get("kakao_account").get("email")
            member_nickname = oauth_data.get("properties").get("nickname")
            member_profile_image = oauth_data.get("properties").get("profile_image")
        else:
            member_email = oauth_data.get("email")
            member_nickname = oauth_data.get("name")
            member_phone = oauth_data.get("phone")
            member_profile_image = oauth_data.get("picture")

        data = {
            'member_email': member_email,
            'member_name': member_nickname,
            # 'member_profile_image': member_profile_image,
        }
        # member = Member.objects.filter(member_email=data['member_email'])
        # 최초 로그인 검사
        member, created = Member.objects \
            .get_or_create(member_email=member_email, member_type=user.provider, member_name=member_nickname)

        url = '/'
        print("존재함2")

        # if member.exists():
        #     request.session['member'] = MemberSerializer(member.first()).data
        # else:
        #     request.session['join-member-data'] = data
        #     url = "member:join"



        # 최초 로그인(회원가입 필요)
        # 반드시 입력받아야 되는 것을 써야된다.
        url = "main"
        if member.member_name is None or created:
            # return redirect(f'/?member=_email={member_email}&member_type={user.provider}&id={member.id}')
            url = f'/member/join/?member_email={member_email}&member_type={user.provider}&id={member.id}&member_name={member.member_name}'

        # OAuth 최초 로그인이 아닐 경우 조회된 member 객체를 세션에 담아준다.
        request.session['member'] = MemberSerializer(member).data

        return redirect(url)