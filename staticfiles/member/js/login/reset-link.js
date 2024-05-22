// 로그인 버튼
const goTologin = document.querySelector('#go-to-login');
// 확인 버튼
const resetDone = document.querySelector('#reset-done');
// 비밀번호 입력 전체칸
const pwInputSection = document.querySelector('.pw-input-section');
// '새로 사용하기를 원하는...'텍스트
const resetText = document.querySelector('.desc-a');
// 비밀번호 재설정 성공 텍스트
const doneText = document.querySelector('.desc-b');

// '확인' 버튼을 누르면, 비밀번호 재설정 입력칸이 사라지고, 성공 메세지 출력하고, 로그인 창으로
// 넘어갈 수 있는 창으로 이동 버튼이 나옴(이동 버튼 = '로그인' 버튼)

resetDone.addEventListener('click', () => {
    goTologin.style.display = 'block';
    resetDone.style.display = 'none';
    pwInputSection.style.display = 'none';
    resetText.style.display = 'none';
    doneText.style.display = 'block';
});

// 비밀번호 첫번쨰 입력칸
const pwInputboxA = document.querySelector('#new-pw');
// 비밀번호 두번째 입력칸
const pwInputboxB = document.querySelector('#new-pw-re');
// 에러1 알림 텍스트
const pwCondition = document.querySelector('.focus-text');
// 에러2 알림 텍스트
const pwConditionError = document.querySelector('.helper-text-error');

// 비밀번호 첫번쨰 입력칸에 8글자 미만 에러1 알림 텍스트가 나오고 boder의 테두리 색상이 빨간색으로 변경된다.
// 8글자 이상이면 테두리 색상이 초록색으로 변경된다.

pwInputboxA.addEventListener('keyup', (e) => {
    if (e.target.value.length < 8) {
        pwCondition.style.display = 'block';
        pwCondition.style.color = '#f66';
        e.target.style.border = '2px solid #f66';
    } else {
        pwCondition.style.display = 'none';
        e.target.style.border = '2px solid #008243';
    }
});

// 비밀번호 두번째 입력칸의 value가 비밀번호 입력칸의 value와 같으면 테두리가 초록색으로 변경된다.
// value가 같지 않으면 테두리가 빨간색으로 바뀌고 에러2 알림 텍스트가 나온다.
pwInputboxB.addEventListener('keyup', (e) => {
    if (e.target.value === pwInputboxA.value) {
        e.target.style.border = '2px solid #008243';
        pwConditionError.style.display = 'none';
    } else {
        e.target.style.border = '2px solid #f66';
        pwConditionError.style.display = 'block';
        pwConditionError.style.color = '#f66';
    }
});