let page = 1

// const moreButton = document.getElementById("more");

const tabbtns = document.querySelectorAll("div.ui-tabs ul li");

const getList = (callback) => {
    fetch(`http://127.0.0.1:10000/notification/list/${page}`)
        .then((response) => response.json())
        .then((notifications) => {
            if(callback){
                callback(notifications)
            }
        })
}

const li = document.querySelector("div.board-main ul li");
const showList = (notification_info) => {

    let notifications = notification_info.notifications

    notifications.forEach((notification) =>{
        const createdDate = new Date(notification.created_date);
        // 날짜를 원하는 형식으로 변환 (예: YYYY-MM-DD)
        const formattedDate = `${createdDate.getFullYear()}-${(createdDate.getMonth() + 1).toString().padStart(2, '0')}-${createdDate.getDate().toString().padStart(2, '0')} `;
        // status 명 변경 0: 커뮤니티, 1: 원랩, 2: 장소공유, 3: 대회공모전
        let status = notification.notification_status;
        if(status === 0){
            status = '커뮤니티'
        } else if(status === 1){
            status = '원랩'
        } else if(status === 2){
            status = '장소공유'
        } else {
            status = '공모전'
        }
        let upload = '/upload/';
        const imageURL = notification.notification_file ? notification.notification_file : 'notification/2024/03/15/realfavicon.png';

        li.innerHTML += `
            <a class="article" href="/notification/detail/?id=${notification.id}">
                <em class="notice">${status}</em>
                <div class="info">
                    <div class="thumb" style="background-image: url('${upload}${imageURL}')">
                        
                    </div>
                    <h3 class="title">${ notification.notification_title }</h3>
                    <span class="author">관리자</span>
                    <span class="created-at">${ formattedDate }</span>
                </div>
            </a>
        `
    })
}

getList(showList);

// for (let i=0; i< tabbtns.length; i ++) {
//     tabbtns[i].addEventListener("click", (e)=>{
//         tabbtns.forEach(tabbtn=> tabbtn.classList.remove("active"));
//         e.currentTarget.classList.add("active");
//         page = 1;
//         category = i;
//         fetch(`http://127.0.0.1:10000/notification/list/${page}?category=${category}`)
//             .then((response) => response.json())
//             .then((notifications) => {
//                 li.innerHTML = '';
//                 showList(notifications);
//             })
//     })
// }
//
// const pageLinks = document.querySelectorAll(".pagination a");
//
// pageLinks.forEach(link => {
//     link.addEventListener("click", (e)=> {
//         e.preventDefault();
//
//         const pageNumber = parseInt(e.target.getAttribute("data-page"));
//         fetch(`http://127.0.0.1:10000/notification/list/${pageNumber}?category=${category}`)
//             .then(response => response.json())
//             .then(notifications => {
//                 // 리스트 업데이트
//                 li.innerHTML = '';
//                 showList(notifications);
//             })
//             .catch(error => console.error('Error:', error));
//     });
// });
//
//
// const searchButton = document.getElementById("searchButton");
//
// searchButton.addEventListener("click", () => {
//     const searchText = document.getElementById('searchTextInBoard').value;
//     const searchOption = document.getElementById('searchSelectInBoard').value;
//
//     fetch(`http://127.0.0.1:10000/notification/list/${page}?category=${category}&type=${searchOption}&keyword=${searchText}`)
//         .then((response) => response.json())
//         .then((notifications) => {
//             li.innerHTML = '';
//             showList(notifications);
//         })
//         .catch(error => console.error('Error:', error));
// });
let currentCategory = 0;

function setCurrentCategory(index) {
    currentCategory = index;
}

function initialize() {
    const tabbtns = document.querySelectorAll("div.ui-tabs ul li");
    const pageLinks = document.querySelectorAll(".pagination a");
    const searchButton = document.getElementById("searchButton");

    // 카테고리, 페이지, 검색 기능을 처리하는 함수 등록
    tabbtns.forEach((tabbtn, index)  => {
        tabbtn.addEventListener("click", (e)=> {
            setCurrentCategory(index);
            tabbtns.forEach(tabbtn=> tabbtn.classList.remove("active"));
            e.currentTarget.classList.add("active");
            handleTabClick(index);
        });
    });

    pageLinks.forEach(link => {
        link.addEventListener("click", (e)=> handlePageLinkClick(e));
    });

    searchButton.addEventListener("click", () => handleSearch());
}

// 탭 클릭 이벤트 핸들러
function handleTabClick(index) {
    const page= 1;
    const category = index;
    fetchNotifications(page, category);
}

//페이지 링크 클릭 이벤트 핸들러
function handlePageLinkClick(e) {
    e.preventDefault();
    const pageNumber = parseInt(e.target.getAttribute("data-page"));
    const category = currentCategory;
    fetchNotifications(pageNumber, category);
}



// 검색 버튼 클릭 이벤트 핸들러
function handleSearch() {
    const searchText = document.getElementById('searchTextInBoard').value;
    const searchOption = document.getElementById('searchSelectInBoard').value;
    const page = 1;
    const category = currentCategory;
    fetchNotifications(page, category, searchOption, searchText);
}


// 서버에서 데이터 가져오는 함수
function fetchNotifications(page, category, searchOption='', searchText='') {
    let url = `http://127.0.0.1:10000/notification/list/${page}?category=${category}`;
    // 검색 옵션과 검색어가 주어진 경우 URL에 추가
    if (searchOption && searchText) {
        url += `&type=${searchOption}&keyword=${searchText}`;
    }

    fetch(url)
        .then((response) => response.json())
        .then((notifications) => {
            const li = document.querySelector("div.board-main ul li");
            li.innerHTML = '';
            showList(notifications);
        })
        .catch(error => console.error('Error:', error));

}

initialize();