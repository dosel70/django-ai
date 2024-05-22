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
        }, 10);
    }
}
goTopButton.addEventListener('click', scroll)

const tabButtons = document.querySelectorAll(".image-tab")

tabButtons.forEach((tabButton) => {
    tabButton.addEventListener("click", function(e) {
        tabButtons.forEach((tabButton) => {
            clickTab = tabButton.querySelector(".image-tab-label")
            clickTabImg = tabButton.querySelectorAll(".image-tab-thumbnail")
            tabButton.classList.remove('active')
            clickTab.classList.remove('active')
            clickTabImg[1].classList.add('image-tab-hide')
        })
        clickTab = e.target.querySelector(".image-tab-label")
        clickTabImg = e.target.querySelectorAll(".image-tab-thumbnail")
        e.target.classList.add('active')
        clickTab.classList.add('active')
        clickTabImg[1].classList.remove('image-tab-hide')

    })
})

// Initialize Slick slider
$('.tabs-mobile-tab').slick({
    infinite: false,
    slidesToShow: 11,
    slidesToScroll: 10,
    dots: false,
    arrows: false,
    draggable: false,
    swipe: false
  });

// Click event for moving to next tab
$('.tabs-mobile-nav').on('click', function(e){
    $('.tabs-mobile-tab').slick('slickNext');
});

const arrowBtn = document.querySelector(".tabs-mobile-nav")
arrowBtn.addEventListener("click", function(e) {
    if(arrowBtn.classList[1]) {
        arrowBtn.classList.remove('left')
    }else {
        arrowBtn.classList.add('left')
    // Click event for moving to next tab
    $('.tabs-mobile-nav.left').on('click', function(e){
        $('.tabs-mobile-tab').slick('slickPrev');
    });
    }
})


// 목록 fetch
let page = 1
const moreButton = document.getElementById("more");
const getList = (callback) => {
    fetch(`http://127.0.0.1:10000/share/list/${page}`)
    .then((response) => response.json())
    .then((shares) => {
        if(callback){
            callback(shares)
        }
    })
}
const shareWrapper = document.querySelector(".table-layout-container");
const likeImgUrl = 'share/images/like.png'
const showList = (share_info) => {
    if (!share_info.hasNext) {
        moreButton.style.display = 'none';
    }else {
        moreButton.style.display = 'block';
    }
    let shares = share_info.shares;
    shares.forEach((share) => {
        // 좋아요를 누른 게시글
        const member_like = share_info.member_like[share.id];

        let universityLogo;
        if (share.university_name === '카이스트') {
            universityLogo = "/static/public/images/kaist-logo.svg";
        } else if (share.university_name === '연세대학교') {
            universityLogo = '/static/public/images/yns-logo.png';
        } else if (share.university_name === '서울대학교') {
            universityLogo = '/static/public/images/snu-logo.svg';
        } else if (share.university_name === '고려대학교') {
            universityLogo = '/static/public/images/korea-logo.svg';
        } else {
            universityLogo = "/static/public/images/realfavicon.png";
        }
        let html = `
            <div class="home-vertical-card-container">
                <a href="/share/detail/${share.id}" class="home-vertical-card-content">
                    <div class="home-vertical-card-thumbnail-box" style="padding-top: 56.25%;">
                        <div class="home-vertical-card-thumbnail-wrap">
                            <div class="thumbnail-img-container">
                                <img class="thumbnail-img" src="${universityLogo}" alt="">
                            </div>
                        </div>
                    </div>
                    <div class="home-vertical-card-info-box">
                        <div class="home-vertical-card-info">
                            <!-- 자료의 확장자가 들어가는 뱃지 -->
                            <div class="store-badge-group-container">
                                <div class="store-badges">
                                    ${share.share_files.map(file => {
                                        let badgeClass = '';
                                        switch(file.file_extension.toLowerCase()) {
                                            case 'pdf':
                                                badgeClass = 'pdf';
                                                break;
                                            case 'hwp':
                                                badgeClass = 'hwp';
                                                break;
                                            case 'xls':
                                                badgeClass = 'xls';
                                                break;
                                            case 'xlsx':
                                                badgeClass = 'xlsx';
                                                break;
                                            case 'docx':
                                                badgeClass = 'docx';
                                                break;
                                            default:
                                                badgeClass = '';
                                        }
                                        return `<span class="label-badge ${badgeClass}">${file.file_extension.toUpperCase()}</span>`;
                                    }).join('')}
                                </div>
                            </div>
                            <p class="info-string-wrapper">${share.share_points} 포인트</p>
                            <strong class="title">${share.share_title}</strong>
                            <p class="home-vertical-card-maker-name-wrapper" style="font-size: 15px;">${timeForToday(share.created_date)}</p>
                            <div class="like-wrapper">
                                <p class="home-vertical-card-maker-name-wrapper" style="font-size: 15px;">${share.member_name} ${share.share_choice_major} ${share.share_choice_grade}</p>
                                <div style="display: flex;">
                                    <img src="https://freesvg.org/img/1433686694.png" class="like-img-box" alt="">
                                    <p class="like-count-wrap">${share.share_like_count}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                
            `;
            if (member_like) {
                html += `
                <button type="button" class="wish-btn like-btn ${share.id} active" id="like-btn">
                    <svg viewBox="0 0 32 32" focusable="false" role="presentation" class="wish-icon" aria-hidden="true">
                        <path class="dislike-icon" d="M22.16 4h-.007a8.142 8.142 0 0 0-6.145 2.79A8.198 8.198 0 0 0 9.76 3.998a7.36 7.36 0 0 0-7.359 7.446c0 5.116 4.64 9.276 11.6 15.596l2 1.76 2-1.76c6.96-6.32 11.6-10.48 11.6-15.6v-.08A7.36 7.36 0 0 0 22.241 4h-.085z"></path>
                    </svg>
                </button>
                `;
            }
            else {
                html += `
                <button type="button" class="wish-btn like-btn ${share.id}" id="like-btn">
                    <svg viewBox="0 0 32 32" focusable="false" role="presentation" class="wish-icon" aria-hidden="true">
                        <path class="dislike-icon" d="M22.16 4h-.007a8.142 8.142 0 0 0-6.145 2.79A8.198 8.198 0 0 0 9.76 3.998a7.36 7.36 0 0 0-7.359 7.446c0 5.116 4.64 9.276 11.6 15.596l2 1.76 2-1.76c6.96-6.32 11.6-10.48 11.6-15.6v-.08A7.36 7.36 0 0 0 22.241 4h-.085z"></path>
                    </svg>
                </button>
                `;
            }

        // 게시글 shareWrapper에 추가
        shareWrapper.innerHTML += html;

    });

    // 좋아요 반영할 게시글 id
    async function likePost(jsonData) {
        try {
            const response = await fetch('/share/like/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: jsonData
            });
            if (!response.ok) {
                throw new Error('서버 응답 오류');
            }
            return await response.json();
        } catch (error) {
            console.error('에러:', error);
        }
    }
    // 좋아요
    const likeBtns = document.querySelectorAll('button.like-btn')
    likeBtns.forEach((likeBtn) => {
        likeBtn.addEventListener('click', async function(e) {
            e.preventDefault()
            likeBtn.classList.toggle('active')
            const jsonData = JSON.stringify({'share_id': e.target.classList[2]})
            const updatedLikes = await likePost(jsonData);
        });
    });

}

getList(showList);
moreButton.addEventListener("click", (e) => {
    page ++;
    getList(showList);
});


// 몇일 전에 작성된 글인지 계산
function timeForToday(datetime) {
    const today = new Date();
    const date = new Date(datetime);

    let gap = Math.floor((today.getTime() - date.getTime()) / 1000 / 60);

    if (gap < 1) {
        return "방금 전";
    }

    if (gap < 60) {
        return `${gap}분 전`;
    }

    gap = Math.floor(gap / 60);

    if (gap < 24) {
        return `${gap}시간 전`;
    }

    gap = Math.floor(gap / 24);

    if (gap < 31) {
        return `${gap}일 전`;
    }

    gap = Math.floor(gap / 31);

    if (gap < 12) {
        return `${gap}개월 전`;
    }

    gap = Math.floor(gap / 12);

    return `${gap}년 전`;
}


function getGrade() {
    const selectGrade = document.querySelector('.order-select-box');
    const option = selectGrade.options[selectGrade.selectedIndex];
    const gradeSort = option.value === '전체' ? 'all' : option.value;

    const majorChoice = document.querySelector('.image-tab-label.active').getAttribute('data-text');
    const majorSort = majorChoice === '전체 학과' ? 'all' : majorChoice;

    const tab = document.querySelector('.order-select-desktop-sort-item.active')
    let sortOrder = 'latest'; // 기본값은 최신순
        if (tab.textContent === '인기순') {
            sortOrder = 'popular';
        } else if (tab.textContent === '최신순') {
            sortOrder = 'latest';
        }

    // 해당 학년과 학과 다시 로드
    page = 1;
    const url = `http://127.0.0.1:10000/share/list/${page}?gradeSort=${gradeSort}&majorSort=${majorSort}&sortOrder=${sortOrder}`;
    fetch(url)
        .then(response => response.json())
        .then(shares => {
            shareWrapper.innerHTML = ''; // 이전 내용 초기화
            showList(shares);
        });
}

// 학과 필터
const majorChoiceBtns = document.querySelectorAll('.image-tab');
majorChoiceBtns.forEach((majorChoiceBtn) => {
    majorChoiceBtn.addEventListener('click', (e) => {
        getGrade();
    });
});


// 인기순 필터
const tabs = document.querySelectorAll('.order-select-desktop-sort-item')
tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
        tabs.forEach((tab) => {
            tab.classList.remove('active')
        })
        tab.classList.add('active')
        getGrade();
    })
})



