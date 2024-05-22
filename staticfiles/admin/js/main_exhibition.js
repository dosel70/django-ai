/**  전체선택 했을 시에 체크박스 전체 선택 되게 하는 js 코드 */
function selectAll(selectAll) {
    const checkboxes = document.querySelectorAll(
        'input[type="checkbox"]'
    ); /* type = checkbox 인 요소들을 불러온다. */

    checkboxes.forEach((checkbox) => {
        /* 모든 체크 박스들을 순회하여 */
        checkbox.checked =
            selectAll.checked; /* 모든 체크박스들을 체크시킨다. */
    });
}


let page = 1
const getList = (callback) => {
    fetch(`http://127.0.0.1:10000/member/admin_main_exhibition/${page}`)
        .then((response) => response.json())
        .then((notifications) => {
            if(callback){
                callback(notifications)
            }
        });
}

const value = document.querySelector("div.col-center");
const count = document.querySelector("div span.ml-4");

const showList = (exhibition_info) => {
    let exhibitions = exhibition_info.exhibitions;
    let total = exhibition_info.total_count;
    exhibitions.forEach((exhibition) => {
        const createdDate = new Date(exhibition.created_date);
        const formattedDate = `${createdDate.getFullYear()}-${(createdDate.getMonth() + 1).toString().padStart(2, '0')}-${createdDate.getDate().toString().padStart(2, '0')} `;
        count.innerText = `${total}`;
        value.innerHTML += `
            <li class="user-list">
                <input class="check2" name="num2" type="checkbox">
                <span class="number">${exhibition.id}</span>
                <span class="email">
                    <a href="/exhibition/detail/?id=${exhibition.id}">
                        ${exhibition.exhibition_title}
                    </a>  
                </span>
                <span class="info">${exhibition.school__member__member_name}</span>
                <span class="date">${formattedDate}</span>
                <span class="type">${exhibition.exhibition_view_count}</span>
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
        // const selectedOption = document.getElementById("selectedOption");
        // const option = selectedOption.textContent;
        const option = '';
        fetchExhibitions(option, page);
    }
}

function fetchExhibitions(option, page){
    let url = `http://127.0.0.1:10000/member/admin_main_exhibition/${page}?option=${option}`;

    fetch(url)
        .then((response) => response.json())
        .then((exhibitions) => {
            const value = document.querySelector("div.col-center");
            value.innerHTML = '';
            showList(exhibitions);
        })

}

initialize();


function getCSRFToken() {
    const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
    return csrfTokenMeta.getAttribute('content');
}

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
    fetch('http://127.0.0.1:10000/member/soft_delete_exhibition/', {
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
        currentPage = 1;
        fetchNotifications(option, currentPage);
        toggleDropdown("dropdownOptions");
    }
}