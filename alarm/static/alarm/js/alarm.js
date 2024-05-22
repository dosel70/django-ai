const notificationContainer = document.querySelector(".notification-container")
let page =1
const mainTotalCount = document.querySelector('.notification-app-total')

// 시간 변환 함수
function timeSince(dateString) {
    // 올바른 날짜 형식으로 변환 (예: "2024-03-15")
    const formattedDateString = dateString.replace(/(\d{2})-(\d{2})-(\d{2})/, "20$1-$2-$3");
    const date = new Date(formattedDateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 86400; // 일 단위
    if (interval > 1) {
        return Math.floor(interval) + "일 전";
    }
    return "오늘";
}
const prPagination = document.querySelector('.pagination-contents')
const totalCount = document.querySelector('.notification-app-total')

//페이지네이션 클릭 시 되는 함수
const addPaginationEvent = (pageNationNewInfo) => {
    const leftButton = document.getElementById('leftButton')
    const rightButton = document.getElementById('rightButton')
    const prPaginationPages = document.querySelectorAll(".page-numbers")
    const prPaginationPageNumbers = document.querySelectorAll(".page-number-btn")
    const onelabAgree = document.querySelectorAll('.onelab-agree')
    const onelabDeny = document.querySelectorAll('.onelab-deny')
    const onelabCancel = document.querySelectorAll('.onelab-cancel')

    leftButton.addEventListener('click', async () => {
        if (pageNationNewInfo.page <= 1) return;
        await alarmModuleService.pageNation(--page, showList);
    })

    rightButton.addEventListener('click', async () => {
        if (pageNationNewInfo.page === pageNationNewInfo.real_end) return;
        await alarmModuleService.pageNation(++page, showList);
    })

    prPaginationPageNumbers.forEach((btn, i) => {
        btn.addEventListener('click', async () =>{
            page = prPaginationPageNumbers[i].innerHTML;
            await alarmModuleService.pageNation(page, showList)
        })
    })
    onelabAgree.forEach((btn, i) => {
        btn.addEventListener('click', async () =>{
            alarmClickValue = onelabAgree[i].value
            alarmClickId = onelabAgree[i].classList[1]
            onelabAgree[i].classList.add('agree')
            await alarmModuleService.oneLabAgree(alarmClickId, alarmClickValue)
            await alarmModuleService.pageNation(1, showList)
            mainTotalCount.innerHTML = `<strong>${pageNationNewInfo.alarm_total_count}</strong>`
        })
    })
    onelabDeny.forEach((btn, i) => {
        btn.addEventListener('click', async () =>{
            alarmClickValue = onelabDeny[i].value
            alarmClickId = onelabDeny[i].classList[1]
            await alarmModuleService.oneLabDeny(alarmClickId, alarmClickValue)
            await alarmModuleService.pageNation(1, showList)
            mainTotalCount.innerHTML = `<strong>${pageNationNewInfo.alarm_total_count}</strong>`
        })
    })
    onelabCancel.forEach((btn, i) => {
        btn.addEventListener('click', async () =>{
            alarmClickValue = onelabCancel[i].value
            alarmClickId = onelabCancel[i].classList[1]
            await alarmModuleService.oneLabCancel(alarmClickId, alarmClickValue)
            await alarmModuleService.pageNation(1, showList)
            mainTotalCount.innerHTML = `<strong>${pageNationNewInfo.alarm_total_count}</strong>`
        })
    })

}


// 페이지네이션 함수
const showPagination = (pageNationNewInfo)=> {
    const totalCount = pageNationNewInfo.alarm_total_count
    const startPage = pageNationNewInfo.start_page
    const endPage =pageNationNewInfo.end_page
    const currentPage = pageNationNewInfo.page
    const realEnd = pageNationNewInfo.real_end

    if (totalCount ===0){
        prPagination.innerHTML =``
    }else{
        prPagination.innerHTML = `
            <button class="next-btn ${currentPage === 1 ? 'disabled': ''}" type="button" id="leftButton">
                <svg xmlns="http://www.w3.org/2000/svg" class="left-arrow-svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
            </button>
            <div class="page-numbers" id="pageButtons">
        `;
        for (let i = startPage; i <= endPage; i++){
            prPagination.innerHTML += `
            <button class="page-number-btn ${currentPage=== i ? 'focus-page' : ''}" type="button" value="">${i}</button>    
            `
        }
        prPagination.innerHTML += `
        </div>
        <button class="next-btn ${currentPage === realEnd ? 'disabled' : ''}" type="button" id="rightButton">
            <svg xmlns="http://www.w3.org/2000/svg" class="right-arrow-svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
            </svg>
        </button>
        `
        addPaginationEvent(pageNationNewInfo)
    }
}

// 최초 알림 개수를 뿌리는 함수 (5개씩)
const showList = (pageNationNewInfo) => {
    let text = ``
    mainTotalCount.innerHTML = `<strong>${pageNationNewInfo.alarm_total_count}</strong>`
    let alarmList = pageNationNewInfo.alarm_list
    let login_id = pageNationNewInfo.login_id
    let login_name = pageNationNewInfo.login_name

    if (alarmList.length ===0){
        text += `<div class="none-alarm-text">등록된 알림이 없습니다.</div>`
        mainTotalCount.innerHTML = `<strong>${pageNationNewInfo.alarm_total_count}</strong>`
    }else{
        alarmList.forEach((alarmInfo) => {
            let time = timeSince(alarmInfo.created_date)
            if(alarmInfo.onelab_owner === login_id && alarmInfo.alarm_receiver === login_name && alarmInfo.alarm_status === 2) {
                text += `
                    <div class="alarm-list-container">
                        <a class="notification-list-detail">
                            <div>
                                <div class="notification-icon-area">
                                    <img src="/static/alarm/images/letter_icon_small.png" class="notification-type-icon" />
                                </div>
                            </div>
                            <div class="notification-info">
                                <div class="notification-info-Line">
                                    <div class="notification-type">
                                        <span class="badge-container">
                                            <span class="badge-content">${alarmInfo.alarm_message}</span>
                                            <span class="notification-date-time">${time}</span>
                                            <span class="notification-date-time">${alarmInfo.created_date}</span>
                                        </span>
        
                                    </div>
                                    <!-- member_id 와 onelab 의 member id 같은 경우만 출력                          -->
                                    <div class="onelab-button-container">
                                        <button class="onelab-agree ${alarmInfo.id}" value="수락" type="button">수락</button>
                                        <button class="onelab-deny ${alarmInfo.id}" value="거절" type="button">거절</button>
                                    </div>
                                </div>
                                <!-- alarm status 에 따라서 출력하는 결과가 달라야 함             -->
                                <p class="notification-result">${alarmInfo.alarm_sender}의 ${alarmInfo.onelab_titie} 가입신청 ${alarmInfo.alarm_message}</p>
                            </div>
                        </a>
                    </div>
                `
            //   alarm_sender 의 경우 session의 아이디가 들어가야 함
            }else if((alarmInfo.alarm_sender === login_name)){
                text += `
                    <div class="alarm-list-container">
                        <a class="notification-list-detail">
                            <div>
                                <div class="notification-icon-area">
                                    <img src="/static/alarm/images/letter_icon_small.png" class="notification-type-icon" />
                                </div>
                            </div>
                            <div class="notification-info">
                                <div class="notification-info-Line">
                                    <div class="notification-type">
                                        <span class="badge-container">
                                            <span class="badge-content">${alarmInfo.alarm_message}</span>
                                            <span class="notification-date-time">${time}</span>
                                            <span class="notification-date-time">${alarmInfo.created_date}</span>
                                        </span>        
                                    </div>
                                    <button class="onelab-cancel ${alarmInfo.id}" value="삭제" type="button">삭제</button>
                                </div>
                                <!-- alarm status 에 따라서 출력하는 결과가 달라야 함             -->
                                <p class="notification-result">${alarmInfo.alarm_sender}의 ${alarmInfo.onelab_titie} 상태: ${alarmInfo.alarm_message}</p>
                            </div>
                        </a>
                    </div>
                `
            }
            else {
                text += ` 
                `
            }
        })
    }
    notificationContainer.innerHTML = text
    mainTotalCount.innerHTML = `<strong>${pageNationNewInfo.alarm_total_count}</strong>`
    showPagination(pageNationNewInfo)
}

alarmModuleService.pageNation(page, showList)

