let page = 1
const moreButton = document.getElementById("more");
const getList = (callback) => {
    fetch(`http://127.0.0.1:10000/share/review/list/${share_id}/${page}`)
    .then((response) => response.json())
    .then((reviews) => {
        if(callback){
            callback(reviews)
        }
    })
}

const showList = (review_info) => {
    if (!review_info.hasNext) {
        moreButton.style.display = 'none';
    } else {
        moreButton.style.display = 'block';
    }
    let reviews = review_info.reviews;
    const reviewWrapper = document.querySelector(".comment-container-comment-wrapper");
    const reviewAvrWrapper = document.querySelector('.rating-score-lg-full');
    const reviewCountWrapper = document.querySelector('.detail-info-header-participation-info')
    reviewCountWrapper.innerHTML = '';
    reviewAvrWrapper.innerHTML = '';
    reviewWrapper.innerHTML = '';
    reviewAvrWrapper.innerHTML +=
            `<div class="rating-score-icon"></div>
            <span class="rating-score-score">${review_info.review_avg}</span>
            <span class="rating-score-max-score">5.0</span>`
    reviewCountWrapper.innerHTML +=
        `<div>
            <a class="detail-info-header-rating" href="">
                <div class="rating-score-sm-title">
                    <div class="rating-score-icon" ></div>
                    <span class="rating-score-score" style="font-size: 14px; line-height: 3;">${review_info.review_avg}</span>
                </div>
            </a>
        </div>
        <div class="detail-info-header-order-info">
            <span class="detail-info-header-text">${review_info.review_count}</span>명 참여
        </div>`
    // 리뷰 하나씩 추가
    reviews.forEach((review) => {
        console.log(review.profile_files)
        memberProfile = review.profile_files[0].path
        console.log(memberProfile)
            const hasImage = review.review_files.length > 0;
            let schoolName = '';
            if (review.review__member__member_school_email.includes('snu')) {
                schoolName = '서울대학교';
            }else if (review.review__member__member_school_email.includes('kaist')) {
                schoolName = '카이스트';
            }else if (review.review__member__member_school_email.includes('korea')) {
                schoolName = '고려대학교';
            }else if (review.review__member__member_school_email.includes('yonsei')) {
                schoolName = '연세대학교';
            }
            const profile =
            reviewWrapper.innerHTML += `
                <div>
                    <!-- 만족도 이름 쪽 -->
                    <div class="comment-profile-profile-container">
                        <a class="comment-profile-profile" href="">
                            <div class="avatar-avatar" style="width: 36px; height: 36px; background-image: url('${memberProfile}')">
                                <span style="background-image: url('${memberProfile}')"></span>
                            </div>
                            <div class="comment-profile-writer-area">
                                <div class="comment-profile-nick-name">${review.member_name}</div>
                                <span class="comment-profile-date">${timeForToday(review.review__created_date)}</span>
                            </div>
                        </a>
                    </div>
                    ${hasImage ? `
                        <!-- 그림 쪽 -->
                        <div class="thumbnail-viewer-container">
                            <div class="thumbnail-viewer-thumbnail-wrap">
                                <img class="thumbnail-viewer-thumbnail" src="${review.review_files[0].path}" style="width: 64px; height: 64px; margin: 25px" alt="" />
                            </div>
                        </div>
                    ` : ''}
                    <!-- 리뷰 쪽 -->
                    <div class="comment-content-content-wrapper">
                        <div class="satisfaction-content-header-header-container">
                            <div class="satisfaction-content-header-left">
                                <div class="comment-content-badges-badge-container">
                                    <span class="label-badge-badge">${schoolName}</span>
                                </div>
                                
                            </div>
                            <div class="satisfaction-content-header-right">
                                <div class="satisfaction-content-header-rating">
                                    <svg viewBox="0 0 33 33" focusable="false" role="presentation" class="with-icon-icon satisfaction-content-header-star" style="width: 16px; height: 16px; color: rgb(255, 173, 21)">
                                        <path d="M16.5 27l-7.652 4.674a2.001 2.001 0 0 1-2.988-2.171l2.08-8.722-6.81-5.833a2 2 0 0 1 1.143-3.513l8.937-.716 3.443-8.28a2.001 2.001 0 0 1 3.694.001l3.443 8.279 8.938.716a2.001 2.001 0 0 1 1.141 3.513l-6.81 5.833 2.081 8.722a2.001 2.001 0 0 1-1.481 2.41 2.002 2.002 0 0 1-1.507-.24L16.5 27z" fill-rule="evenodd"></path>
                                    </svg>
                                    <span class="satisfaction-content-header-score">${review.review__review_rating}</span>
                                </div>
                            </div>
                        </div>
                        <p class="comment-content-area-full-comment">${review.review__review_content}</p>
                    </div>
                </div>
            `;
        });
}

getList(showList);

moreButton.addEventListener("click", (e) => {
    page ++;
    getList(showList);
});


// 몇일 전에 작성된 후기인지 계산
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

function getNewList() {
    const sort = document.querySelector('.order-select-desktop-active').textContent

    // 클릭된 항목에 따라 정렬 방식 설정
        let sortOrder = 'latest'; // 기본값은 최신순
        if (sort === '높은평점순') {
            sortOrder = 'highest_rating';
        } else if (sort ==='낮은평점순') {
            sortOrder = 'lowest_rating';
        } else if (sort === '최신순') {
            sortOrder = 'latest';
        }

        page = 1
        // 서버에 정렬 방식을 전달하고 리뷰 다시 로드
        fetch(`http://127.0.0.1:10000/share/review/list/${share_id}/${page}/?sort=${sortOrder}`)
            .then(response => response.json())
            .then(reviews => {
                // 리뷰를 처리하는 코드
                showList(reviews);
            })
}

// 정렬해서 리뷰 다시 로드
const sortTabs = document.querySelectorAll('.order-select-desktop-sort-item')
    sortTabs.forEach(item => {
    item.addEventListener('click', () => {
        sortTabs.forEach((item) => {
            item.classList.remove('order-select-desktop-active')
        })
        item.classList.add('order-select-desktop-active')
        getNewList();
    });
});

