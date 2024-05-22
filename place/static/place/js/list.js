// 좋아요
async function likePost(placeId) {
    try {
        const response = await fetch('/place/like/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({'place_id': placeId})
        });
        if (!response.ok) {
            throw new Error('서버 응답 오류');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('에러:', error);
    }
}

const getList = (callback) => {
    fetch(`http://127.0.0.1:10000/place/list/${page}`)
    .then((response) => response.json())
    .then((places) => {
        if(callback){
            callback(places)
        }
    })
}

// 장소 목록을 업데이트하는 함수
let page = 1
const placeListContainer = document.querySelector('.swiper-wrapper');
const showList = (place_info) => {
    placeListContainer.innerHTML = '';
    let places = place_info.places
    places.forEach((place) => {
        let firstFilePath = '';
        if (place.place_files.length > 0) {
            firstFilePath = place.place_files[0].path;
        }
        // 좋아요를 누른 게시글
        const member_like = place_info.member_like[place.id];
        let html = `
            <a href="/place/detail/${place.id}">
                <div class="swiper-slide swiper-slide-active">
                    <!-- 장소 정보 표시 -->
                    <div class="css-main">
                        <div class="css-margin">
                            <div class="css-ivory">
                                <div></div>
                                <div class="css-quwc">
                                    <svg height="10" width="5" viewBox="0 0 5 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0.5 8.75L4.25 5L0.5 1.25" stroke-linecap="round"></path>
                                    </svg>
                                </div>
                                <div></div>
                            </div>
                            <div class="mappins" style="width: 100%;">
                                <img src="/static/place/images/mappin.png" class="mapping" alt="">
                                ${place.place_address}
                            </div>
                            <div class="css-event" style="width: 68px;">
                                <div class="css-import">${place.university_name}</div>
                            </div>
                        </div>
                        <!-- 장소 이미지 표시 -->
                        <div class="css-picture">
                            <img src="${firstFilePath}" alt="Place Image" style="height: 160px; width: 100%">
                        </div>
                        <!-- 기타 장소 정보 표시 -->
                        <div class="css-write">
                            <div class="LinesEllipsis" style="margin-top: 10px">${place.place_title}</div>
                        </div>
                        <div class="css-detail">
                            <div class="LinesEllipsis">예약 가능: ${place.place_date}</div>
                        </div>
                        <div class="css-date">${place.place_points}포인트</div>
                </div>
            </a>
        `;
        // member_like 값에 따라서 버튼 스타일을 추가 또는 제거
        if (member_like) {
            html += `
                <button type="button" class="wish-button-button like-btn ${place.id} active" style="position: absolute; top: -23px; width: 30px">
                    <svg viewBox="0 0 32 32" focusable="false" role="presentation" class="withIcon_icon">
                        <path d="M22.16 4h-.007a8.142 8.142 0 0 0-6.145 2.79A8.198 8.198 0 0 0 9.76 3.998a7.36 7.36 0 0 0-7.359 7.446c0 5.116 4.64 9.276 11.6 15.596l2 1.76 2-1.76c6.96-6.32 11.6-10.48 11.6-15.6v-.08A7.36 7.36 0 0 0 22.241 4h-.085z"></path>
                    </svg>
                </button>
            `;
        } else {
            html += `
                <button type="button" class="wish-button-button like-btn ${place.id}" style="position: absolute; top: -23px; width: 30px">
                    <svg viewBox="0 0 32 32" focusable="false" role="presentation" class="withIcon_icon">
                        <path d="M22.16 4h-.007a8.142 8.142 0 0 0-6.145 2.79A8.198 8.198 0 0 0 9.76 3.998a7.36 7.36 0 0 0-7.359 7.446c0 5.116 4.64 9.276 11.6 15.596l2 1.76 2-1.76c6.96-6.32 11.6-10.48 11.6-15.6v-.08A7.36 7.36 0 0 0 22.241 4h-.085z"></path>
                    </svg>
                </button>
            `;
        }
        // 장소 정보를 컨테이너에 추가
        placeListContainer.innerHTML += html;
    });
    // 좋아요 반영할 게시글 id
    async function likePost(jsonData) {
        try {
            const response = await fetch('/place/like/', {
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

    // 업데이트된 DOM 요소에 좋아요 이벤트
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            e.target.classList.toggle("active");
            const jsonData = JSON.stringify({'place_id': e.target.classList[2]})
            const updatedLikes = await likePost(jsonData);
        });
    });
}

getList(showList)



function getNewList() {
    // 지역
    const area = document.querySelector('.Tab_active').textContent;
    const areaSort = area.trim() === '전체' ? 'all' : area;
    // 페이지
    const page = document.querySelector('.current').textContent;

    const url = `http://127.0.0.1:10000/place/list/${page}?areaSort=${areaSort}`;
    fetch(url)
        .then(response => response.json())
        .then(places => {
            placeListContainer.innerHTML = ''; // 이전 내용 초기화
            showList(places);
        });
}

// 지역 필터
const areaTabs = document.querySelectorAll('.Tab_first');
areaTabs.forEach(areaTab => {
    areaTab.addEventListener('click', () => {
        // 현재 활성화된 탭 클래스를 설정
        areaTabs.forEach(tab => {
            tab.classList.remove('Tab_active');
        });
        areaTab.classList.add('Tab_active');
        getNewList();
    });
});


// 페이지
const pages = document.querySelectorAll("div.desktop-only a")
pages.forEach((page) => {
    page.addEventListener("click", function(e) {
        e.preventDefault()
        pages.forEach((page) => {
            page.classList.remove('current')
        })
        page.classList.add('current')
        getNewList();
    })
})






