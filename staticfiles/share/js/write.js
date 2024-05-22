// 알림 버튼 클릭시 목록 나오기
const announceBtn = document.querySelector('.announce-button-icon')
announceBtn.addEventListener("click", function(e) {
    const container = document.querySelector('.announce-list-container')
    container.classList.toggle('active');
});


// 학과 선택 모달창 리스트 선택
const categoryLists = document.querySelectorAll('li.category-node-container')
categoryLists.forEach((categoryList) => {
    categoryList.addEventListener('click', function(e) {
        const categoryNodeItems = categoryList.children[1];
        const expandBtn = categoryList.querySelector('.category-node-expand-btn')
        categoryNodeItems.classList.toggle('active')
        expandBtn.classList.toggle('rotate')

        categoryList.classList.toggle('selected')
    })
})


// 학과 선택 모달창 나타나고 없어지기
const modalCloseIcon = document.querySelector('button.modal-close-icon-wrapper');
const modal = document.querySelector('div.modal')
const categoryBtn = document.querySelector('button.category-select-btn')
const subLists = document.querySelector('li.sub-category-node-container')

modalCloseIcon.addEventListener('click', function(e) {
    modal.style.display = "none"
})

categoryBtn.addEventListener('click', function(e) {
    modal.style.display = 'block'
})

subLists.addEventListener('click', function(e) {
    modal.style.display = "none"
})



//  자료 유형 선택 시 색과 안내 멘트 속성
const shareRadio = document.querySelector('.radio')
const activeRadio = document.querySelector('span.radio-icon')
const moereInfo = document.querySelector('.section-container.project-intro')

shareRadio.addEventListener('click', function(e) {
    activeRadio.classList.toggle('active')
    if(activeRadio.classList[1]){
        moereInfo.style.display = 'block'
    }else {
        moereInfo.style.display = 'none'
    }

})

// 자료 정보 선택
const fileTypeBtns = document.querySelectorAll('button.maker-type-select-btn')
fileTypeBtns.forEach((btn) => {
    btn.addEventListener('click', function(e) {
        fileTypeBtns.forEach((btn) => {
            btn.classList.remove('active')
        })
        btn.classList.add('active')
    })
})

// textarea 포커스 시, 테두리 색 변경
document.querySelector('.input-text').addEventListener('focus', function(e) {
    e.target.style.border = '1px solid #008243'
})


// textarea 글 작성시 글자수 계산
const introductionText = document.querySelector('.introduction-text');
const introductionCount = document.querySelector('.introduction-count');

introductionText.addEventListener('input', function() {
    const remainingChars = 500 - this.value.length;
    introductionCount.textContent = remainingChars + '자 남음';
});


document.addEventListener("DOMContentLoaded", function() {
    const sectionContent = document.querySelector('.check-document .section-content');
    const fileInput = document.querySelector('.reward-item-add-btn-box input[type="file"]');

    document.querySelector('.reward-item-add-btn-box').addEventListener('click', function() {
        fileInput.click(); // hidden input 요소를 클릭하여 파일 업로드 창을 엽니다.
    });

    fileInput.addEventListener('change', function(event) {
        const fileList = event.target.files;
        if (fileList.length > 0) {
            const file = fileList[0];

            displayPreviewImage(file);
        }
    });

    function isImageFile(file) {
        console.log(file.type.startsWith('image/'))
        return file.type.startsWith('image/');
    }

    function displayPreviewImage(file) {
        const reader = new FileReader();

        reader.onload = function(event) {
            const fileUrl = event.target.result;
            const imageElement = document.createElement('img');
            let fileNameDiv = document.createElement('div');
            console.log(fileUrl)

            // 이미지일 경우
            if(isImageFile(file)){
                imageElement.src = fileUrl;
                imageElement.style.width = "100px";
                imageElement.style.position = "relative";
                sectionContent.appendChild(imageElement);
                // pdf일 경우
            } else if(fileUrl.includes('pdf')) {
                console.log('pdf')
                fileNameDiv.textContent = file.name;
                console.log(file.name);
                sectionContent.appendChild(fileNameDiv);
                // 엑셀일 경우
            }else if(fileUrl.includes('sheet')) {
                console.log('xls')
                fileNameDiv.textContent = file.name;
                console.log(file.name);
                sectionContent.appendChild(fileNameDiv);
            }

            const closeButton = document.createElement('button');
            closeButton.textContent = 'x';
            closeButton.classList.add('close-btn');
            closeButton.addEventListener('click', function() {
                imageElement.remove();
                fileNameDiv.remove();
                closeButton.remove();
                fileInput.value = '';
            });
            sectionContent.appendChild(closeButton);
        };

        reader.readAsDataURL(file);
    }
});

// 제목 작성시 남은 글자수 계산
const inputField = document.getElementById('title-input');
const helperMsg = document.querySelector('.helper-msg');

inputField.addEventListener('input', function() {
    console.log('ss')
    const maxLength = 30;
    const remainingChars = maxLength - this.value.length;
    helperMsg.textContent = remainingChars + '자 남음';
});

const gradeUls = document.querySelectorAll('.category-node-items.active')
const lis = document.querySelectorAll('.sub-category-node-container')
const majorInput = document.querySelector('.share-choice-major')
const gradeInput = document.querySelector('.share-choice-grade')
const majorGradeInput = document.querySelector('.major-grade')

lis.forEach((li) => {
    li.addEventListener('click', (e) => {
        majorInput.value = li.parentElement.previousElementSibling.querySelector('.category-node-label').textContent
        gradeInput.value = li.querySelector('.sub-category-node-label').textContent
        majorGradeInput.value = `${majorInput.value} ${gradeInput.value}`;
        modal.style.display = 'none';
    })
})

shareType = document.querySelector('.share-type')
fileTypeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        shareType.value = btn.querySelector('.maker-type-select-btn-text').textContent
    })
})

// 나가기 버튼 클릭시 모달창
let modalCheck;
const showWarnModal2 = (modalMessage) => {
    modalCheck = false;
    document.getElementById("content-wrap").innerHTML = modalMessage;
    document.querySelector("div.warn-modal").style.animation = "popUp 0.5s";
    document.querySelector("div.modal2").style.display = "flex";
    setTimeout(()=>{
        modalCheck = true;
    }, 500)
}

document.querySelector("div.modal2").addEventListener("click", (e) => {
    if(modalCheck) {
        document.querySelector("div.warn-modal").style.animation = "popDown 0.5s";
        setTimeout(()=>{
            document.querySelector("div.modal2").style.display = "none";
        }, 450)
    }
});

const exitBtn = document.querySelector('.exit-button-text')
exitBtn.addEventListener('click', (e) => {
    let modalMessage = "<span>저장하기 전에 나가시면, 작성하신 모든 정보를 잃게 됩니다.</span>" +
        "<span>정말 나가시겠습니까?</span>" +
        "<div class='exit-modal-btns'><button type='submit' class='real-exit-btn exit-modal-btn'>나가기</button>" +
        "<button type='submit' class='not-exit-btn exit-modal-btn'>취소</button></div>"
    showWarnModal2(modalMessage);

    const realExitBtn = document.querySelector('.real-exit-btn')
    realExitBtn.addEventListener('click', (e) => {
        window.location.href = '/share/list/'
    })
})

const okBtn = document.querySelector('.save-btn')
// 필수 입력칸들 입력 안되어있을 때
const mustInputs = document.querySelectorAll('.must-input')

okBtn.addEventListener('click', function (e){
    let formValid = true;
    let count = 0;
    mustInputs.forEach((mustInput) => {
        if (!mustInput.value) {
            count += 1
            formValid = false;
            let modalMessage = "<span>필수 입력란을 모두 작성해주세요.</span>"
            showWarnModal2(modalMessage);
            e.preventDefault();
        }
    })
    if(count === 0) {
        document.forms['write-form'].submit();
    }
})
