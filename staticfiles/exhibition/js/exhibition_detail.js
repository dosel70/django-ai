const goTopButton = document.querySelector(".float-top-btn");

// 마우스 휠을 위 방향으로 돌릴 때, 상향 버튼 나타나기
window.addEventListener("wheel", (e) => {
    // e.deltaY가 양수면 down wheel, 음수면 up wheel
    // e.deltaX가 양수면, 오른쪽 음수면 왼쪽
    // console.log(e.deltaY, e.deltaX);
    if (e.deltaY < 0) {
        goTopButton.classList.add("active");
    } else {
        goTopButton.classList.remove("active");
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
};
goTopButton.addEventListener("click", scroll);

const replyButtons = document.querySelectorAll(".comment-of-comment-btn");
const replyList = document.querySelector(".comment-reply-list-container");

replyButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
        button.classList.toggle("active");
        replyList.classList.toggle("active");
    });
});

const noLoginWriteBtns = document.querySelectorAll("div.comment-disable-write-form");
const closeButton = document.querySelector("button.close-btn");

noLoginWriteBtns.forEach((button) => {
    button.addEventListener("click", function (e) {
        document.querySelector(".login-modal").classList.add("active");
    });
});

closeButton.addEventListener("click", function (e) {
    document.querySelector(".login-modal").classList.remove("active");
});

const likeBtn = document.querySelector(".community-like-icon");
likeBtn.addEventListener("click", function (e) {
    likeBtn.classList.toggle("active");
});

const textareas = document.querySelectorAll(".comment-textarea");
textareas.forEach((textarea) => {
    textarea.addEventListener("click", function (e) {
        const parentContainer = textarea.closest(".comment-write-form");
        const okButton = parentContainer.querySelector(".comment-ok-btn");
        okButton.classList.add("active");
        e.target.classList.add("active");
    });
});

textareas.forEach((textarea) => {
    textarea.addEventListener("input", function (e) {
        const parentContainer = textarea.closest(".comment-write-form");
        const countSpan = parentContainer.querySelector(".comment-form-count");
        const textLength = textarea.value.length;
        countSpan.textContent = textLength + "/2,000";
        e.target.classList.add("active");
    });
});

const bigPic = document.querySelector("#big-img");
const smallPic = document.querySelectorAll(".lazy-load-img");
smallPic.forEach((list) => {
    list.addEventListener("click", (e) => {
        bigPic.setAttribute("src", e.target.getAttribute("src"));
    });
});



