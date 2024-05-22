let page = 1
const getList = (callback) => {
    fetch(`http://127.0.0.1:10000/member/admin_main_notification/${page}`)
        .then((response) => response.json())
        .then((notifications) => {
            if(callback){
                callback(notifications)
            }
        });
}

const value = document.querySelector("div.col-center");
const count = document.querySelector("div span.ml-4");
const showList = (notification_info) => {
    let notifications = notification_info.notifications;
    let total = notification_info.total_count;
    notifications.forEach((notification) => {
        const createdDate = new Date(notification.created_date);
        // 날짜를 원하는 형식으로 변환 (예: YYYY-MM-DD)
        const formattedDate = `${createdDate.getFullYear()}-${(createdDate.getMonth() + 1).toString().padStart(2, '0')}-${createdDate.getDate().toString().padStart(2, '0')} `;
        count.innerText = `${total}`;
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
        value.innerHTML += `
            <li class="user-list">
                <input class="check2" name="num2" type="checkbox">
                <span class="number">${notification.id}</span>
                <span class="email">
                    <a href="/notification/detail/?id=${notification.id}">
                        ${notification.notification_title}
                    </a>    
                </span>
                <span class="info">${status}</span>
                <span class="date">${formattedDate}</span>
                <span class="type">${notification.notification_view_count}</span>
            </li>
        `
    })
}

getList(showList);

function initialize() {
    const pageLinks = document.querySelectorAll("div a");

    pageLinks.forEach(link => {
        link.addEventListener("click", ()=> {
            const pageNumber = parseInt(link.textContent);
            handlePageLinkClick(pageNumber);
        });
    })
}

function handlePageLinkClick(pageNumber) {
    if (!isNaN(pageNumber)) {
        page = pageNumber;
        const selectedOption = document.getElementById("selectedOption");
        const option = selectedOption.textContent;
        fetchNotifications(option, page);
    }
}


function fetchNotifications(option, page){
    let url = `http://127.0.0.1:10000/member/admin_main_notification/${page}?option=${option}`;

    fetch(url)
        .then((response) => response.json())
        .then((notifications) => {
            const value = document.querySelector("div.col-center");
            value.innerHTML = '';
            showList(notifications);
        })

}

initialize();



function toggleDropdown(dropdownId) {
    var dropdownOptions = document.getElementById(dropdownId);
    if (dropdownOptions) {
        dropdownOptions.style.display =
            dropdownOptions.style.display === "block" ? "none" : "block";
    }
}

function selectOption(option) {
    var selectedOption = document.getElementById("selectedOption");
    if (selectedOption) {
        selectedOption.textContent = option;
        let currentPage = 1;
        fetchNotifications(option, currentPage);
        toggleDropdown("dropdownOptions");
    }
}

// 전체 선택
function selectAll(selectAll) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach((checkbox) => {
        checkbox.checked = selectAll.checked;
    });
}
function getCSRFToken() {
    const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
    return csrfTokenMeta.getAttribute('content');
}

// 삭제 기능
function deleteSelectedItems() {
    const csrfToken = getCSRFToken();

    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const selectedItems = Array.from(checkboxes)
        .filter(checkbox => checkbox.closest(".user-list"))
        .map(checkbox => checkbox.parentElement.querySelector(".number").textContent);

    if (selectedItems.length === 0) {
        alert("삭제할 항목을 선택하세요");
        return;
    }

    console.log(typeof (selectedItems));
    const formData = new FormData();
    selectedItems.forEach(item => {
        const num_data = Number(item);
        console.log(String(num_data), typeof (String(num_data)));
        formData.append("selected_items[]", String(num_data)); // FormData에 각 항목 추가
    });

    for (var key of formData.entries()) {
        console.log(key[0] + ', ' + key[1])
    }
    const data = {selected_items: selectedItems};
    fetch('http://127.0.0.1:10000/member/soft_delete/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('서버 응답에 문제가 있습니다.');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            // 성공적으로 처리된 경우에 대한 작업 수행
            window.location.reload();
        })
        .catch(error => {
            console.error('오류 발생:', error);
            alert('삭제 중 오류가 발생했습니다.');
        });
}


// 버튼 외의 영역을 클릭하면 드롭다운이 사라지도록 이벤트 처리
document.addEventListener("click", function (event) {
    var dropdownOptions2 = document.getElementById("dropdownOptions2");
    var surfaceNoneButtons = document.querySelectorAll(".surface-none");

    if (
        !surfaceNoneButtons.contains(event.target) &&
        !dropdownOptions2.contains(event.target)
    ) {
        dropdownOptions2.style.display = "none";
    }
});

document.addEventListener("click", function (event) {
    var dropdown = document.getElementById("dropdownOptions2");
    var button = document.getElementById("two");

    if (
        event.target !== button &&
        !button.contains(event.target) &&
        event.target !== dropdown &&
        !dropdown.contains(event.target)
    ) {
        dropdown.style.display = "none";
    }
})