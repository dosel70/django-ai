const likes = document.querySelectorAll(".like_btn");
const likeBtn = document.querySelectorAll("button.likes_btns");
likes.forEach((like) => {
    like.addEventListener("click", (e) => {
        console.log(e.target.classList);
        e.target.classList.toggle("active");
        e.ariaPressed = "true";

    });
});

likeBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        console.log(e.target.classList);
        e.target.classList.toggle("active");
        e.ariaPressed = "true";

    });
});

const likeBtns = document.querySelectorAll(".like-btn")
likeBtns.forEach((likeBtn) => {
    likeBtn.addEventListener('click', function(e) {
        likeBtn.classList.toggle('active');
    })
})

const tabs = document.querySelectorAll('.detail-tab')
tabs.forEach((tab) => {
    tab.addEventListener('click', function(e) {
        tabs.forEach((tab) => {
            tab.classList.remove("DetailTab_isActive")
        })
        if(tab.classList[0] == "DetailTab_isActive") {
            tab.classList.remove("DetailTab_isActive")
        }else {
            tab.classList.add("DetailTab_isActive")
        }
    })
})

// const likeBtnDown = document.querySelector('.sticky-btn')
// likeBtnDown.addEventListener('click', function(e) {
//     likeBtnDown.classList.toggle('active')
// })


const goTopButton = document.querySelector('.float-top-btn')

// 마우스 휠을 위 방향으로 돌릴 때, 상향 버튼 나타나기
window.addEventListener('wheel', (e) => {
    // e.deltaY가 양수면 down wheel, 음수면 up wheel
    // e.deltaX가 양수면, 오른쪽 음수면 왼쪽
    // console.log(e.deltaY, e.deltaX);
    if(e.deltaY < 0) {
        goTopButton.classList.add('active')
    }else {
        goTopButton.classList.remove('active')
    }
});

// 위로가기 버튼 클릭 시 맨 위로 이동
const scroll = () => {
    if (window.scrollY !== 0) {
        setTimeout(() => {
            window.scrollTo(0, window.scrollY - 50);
            scroll();
        }, 5);
    }
}
goTopButton.addEventListener('click', scroll)