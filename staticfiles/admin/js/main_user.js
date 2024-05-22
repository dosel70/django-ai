let page = 1
const getList = (callback) => {
    fetch(`http://127.0.0.1:10000/member/admin_main_user/${page}`)
        .then((response) => response.json())
        .then((notifications) => {
            if(callback){
                callback(notifications)
            }
        });
}

const value = document.querySelector("div.col-center");
const count = document.querySelector("p.font-sm");
const showList = (member_info) => {
    let total = member_info.total_count;
    count.innerText = `${total}`;
    let members = member_info.members;

    members.forEach((member) => {
        const createdDate = new Date(member.created_date);
        const formattedDate = `${createdDate.getFullYear()}-${(createdDate.getMonth() + 1).toString().padStart(2, '0')}-${createdDate.getDate().toString().padStart(2, '0')} `;

        value.innerHTML += `
        <li class="user-list">
            <input class="check2" name="num2" type="checkbox">
            <span class="number">${member.id}</span>
            <span class="email">${member.member_email}</span>
            <span class="info">${member.member_name}</span>
            <span class="date">${formattedDate}</span>
            <span class="type">${member['member-type']}</span>
        </li>
    `
    })


}

getList(showList)


function initialize() {
    const pageLinks = document.querySelectorAll("div a");
    const searchButton = document.getElementById("search-button");
    pageLinks.forEach(link => {
        link.addEventListener("click", ()=> {
            const pageNumber = parseInt(link.textContent);
            handlePageLinkClick(pageNumber);
        });
    })
    searchButton.addEventListener("click", () => handleSearch());
}

function handlePageLinkClick(pageNumber) {
    if (!isNaN(pageNumber)) {
        page = pageNumber;
        // const selectedOption = document.getElementById("selectedOption");
        // const option = selectedOption.textContent;
        const option = '';
        fetchMembers(option, page);
    }
}

function handleSearch() {
    const searchText = document.getElementById('searchTextInBoard').value;
    const page = 1;
    const option = '';
    fetchMembers(option, page, searchText);
}

function fetchMembers(option, page, searchText= '') {
    let url = `http://127.0.0.1:10000/member/admin_main_user/${page}?option=${option}`;
    if (searchText) {
        url += `&keyword=${searchText}`;
    }
    fetch(url)
        .then((response) => response.json())
        .then((members) => {
            const value = document.querySelector("div.col-center");
            value.innerHTML = '';
            showList(members)
        })
}

initialize();


/** 버튼태그 클릭하면 드롭다운 메뉴가 나오는 js 기능 */
function toggleDropdown(dropdownId) {
    var dropdownOptions = document.getElementById(dropdownId);
    dropdownOptions.style.display =
        dropdownOptions.style.display === "block" ? "none" : "block";
}

function selectOption(option, buttonId) {
    var selectedOption = document.querySelector(`#${buttonId} span`);
    selectedOption.textContent = option;
    toggleDropdown(`dropdownOptions${buttonId.charAt(buttonId.length - 1)}`);
}


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


function changeToSchoolMember() {
    const csrfToken = getCSRFToken();
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const selectedItems = Array.from(checkboxes)
        .filter(checkbox => checkbox.closest(".user-list"))
        .map(checkbox => checkbox.parentElement.querySelector(".number").textContent);

    if (!selectedItems.length === 1 ) {
        alert("한 명만 선택해주세요!");
        return;
    }

    const formData = new FormData();
    selectedItems.forEach(item => {
        const num_data = Number(item);
        formData.append("selected_items[]", String(num_data));
    })

    const data = {selected_items: selectedItems};
    fetch(`http://127.0.0.1:10000/member/translate/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken' : csrfToken
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('서버 응답에 문제가 있습니다');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            window.location.reload();
        })
        .catch(error => {
            console.error('오류 발생', error);
            alert('전환 중 오류가 발생했습니다.');
        })
}


//
// // 버튼 외의 영역을 클릭하면 드롭다운이 사라지도록 이벤트 처리
// document.addEventListener("click", function (event) {
//     var dropdownOptions2 = document.getElementById("dropdownOptions2");
//     var surfaceNoneButtons = document.querySelectorAll(".surface-none");
//
//     if (
//         !surfaceNoneButtons.contains(event.target) &&
//         !dropdownOptions2.contains(event.target)
//     ) {
//         dropdownOptions2.style.display = "none";
//     }
// });
//
// document.addEventListener("click", function (event) {
//     var dropdown = document.getElementById("dropdownOptions2");
//     var button = document.getElementById("two");
//
//     if (
//         event.target !== button &&
//         !button.contains(event.target) &&
//         event.target !== dropdown &&
//         !dropdown.contains(event.target)
//     ) {
//         dropdown.style.display = "none";
//     }
// })