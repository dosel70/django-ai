// 좋아요
const likeBtns = document.querySelectorAll('.like-btn')
likeBtns.forEach((likeBtn) => {
    likeBtn.addEventListener('click', function(e) {
        likeBtn.classList.toggle('active')
    })
})

// 원랩 참가하기 버튼 클릭시 소통url 모달창 나옴
const modalCloseBtn = document.querySelector('.url-close')
const urlOpenBtn = document.querySelector('.participate')
const urlModal = document.querySelector('.onelab-modal-url')

urlOpenBtn.addEventListener('click', function(e) {
    urlModal.style.display = 'block'
    modalCloseBtn.addEventListener('click', function(e) {
        urlModal.style.display = 'none'
    })
})



// 원랩 지원하기 버튼 클릭시 지원하시겠습니까? 창 나옴
// 취소하기 버튼 클릭시 창 닫힘
// 모달창 내 지원하기 버튼 클릭 시, 원래 모달 사라지고
// 지원완료되었습니다 모달창 나옴
const applyOpenBtn = document.querySelector('.apply')
const applyModal = document.querySelector('.onelab-modal-apply')

applyOpenBtn.addEventListener('click', function(e) {
    applyModal.style.display = 'block'
    const modalCloseBtn = document.querySelector('.apply-close')
    const cancelApplyBtn = document.querySelector('.cancel-text')
    modalCloseBtn.addEventListener('click', function(e) {
        applyModal.style.display = 'none'
    })
    cancelApplyBtn.addEventListener('click', function(e) {
        applyModal.style.display = 'none'
    })
    const applyOkBtn = document.querySelector('.go-member-text')
    applyOkBtn.addEventListener('click', function(e) {
        const applyOkModal = document.querySelector('.onelab-modal-apply-ok')
        const applyOkCloseBtn = document.querySelector('.apply-ok-close')
        applyModal.style.display = 'none'
        applyOkModal.style.display = 'block'
        applyOkCloseBtn.addEventListener('click', function(e) {
            applyOkModal.style.display = 'none'
        })
    })
})

// {% for member in onelab.onelabmember_set.all %}
//     <div class="lab-member-box-container">
//         <div class="lab-member-box member-list">
//             <dl class="lab-member-detail">
//                 <dd class="lab-member-university-icon member">
//                     <i class="university-icon member"></i>
//                 </dd>
//                 <dd class="member-name member">
//                     <strong>{{ member.member_name }}</strong>
//                 </dd>
//             </dl>
//         </div>
//     </div>
// {% endfor %}