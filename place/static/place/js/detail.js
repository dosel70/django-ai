const likes = document.querySelectorAll("button.like_btn");
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

const bigPic = document.querySelector("#big-img");
const smallPic = document.querySelectorAll(".lazy-load-img");

// for (var i = 0; i < smallPic.length; i++) {
//     smallPic[i].addEventListener("click", changepic);
//     console.log(smallPic[i]);
// }

smallPic.forEach((list) => {
    list.addEventListener("click", (e) => {
        bigPic.setAttribute("src", e.target.getAttribute("src"));
    });
});


const tabs = document.querySelectorAll('.detail-tab')
tabs.forEach((tab) => {
    tab.addEventListener('click', function(e) {
        // e.preventDefault();
        tabs.forEach((tab) => {
            tab.classList.remove("DetailTab_isActive")
        })
        if(tab.classList[0] === "DetailTab_isActive") {
            tab.classList.remove("DetailTab_isActive")
        }else {
            tab.classList.add("DetailTab_isActive")
        }
    })
})

const sortTabs = document.querySelectorAll('.order-select-desktop-sort-item')
sortTabs.forEach((tab) => {
    tab.addEventListener('click', function (e) {
        sortTabs.forEach((tab) => {
            tab.classList.remove("order-select-desktop-active")
        })
        if(tab.classList[1] === "order-select-desktop-active") {
            tab.classList.remove('order-select-desktop-active')
        }else {
            tab.classList.add('order-select-desktop-active')
        }
    })
})

// 작성자의 다른 자료 가져오기
// const postsWrapper = document.querySelector('.RecommendationRelated_listContainer')




