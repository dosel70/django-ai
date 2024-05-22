const likes = document.querySelectorAll("button.WishButton_button");

likes.forEach((like) => {
    const color = document.getElementsByClassName("is");
    like.addEventListener("click", (e) => {
        // console.log(e.target.classList);
        e.target.classList.toggle("active");
        e.ariaPressed = "true";
    });
});

const lists = document.querySelectorAll(".css-qn01ot");
const writeList = document.querySelectorAll("div.css-ivvewn");

lists.forEach((list) => {
    list.addEventListener("mouseover", (e) => {
        list.classList.add("list-active");
        // console.log(list.children[1]);
        // list.children[1].style.display = "block";
    });

    list.addEventListener("mouseout", (e) => {
        list.classList.remove("list-active");
        // list.children[1].style.display = "none";
    });
});

// // 무한 스크롤
//
// let page = 1;
// const exhibitionList = document.getElementById('exhibition-list');
// let isLoading = false;
//
// window.addEventListener('scroll', () => {
//     console.log('Scroll event detected'); // 스크롤 이벤트 감지 로그
//     if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 100) && !isLoading) {
//         console.log('Near bottom of page'); // 페이지 하단 감지 로그
//         isLoading = true;
//         page++;
//         fetch(`?page=${page}`, {
//             headers: {
//                 'X-Requested-With': 'XMLHttpRequest'
//             }
//         })
//         .then(response => {
//             console.log('Response received'); // 응답 수신 로그
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log('Loaded data:', data); // 데이터 로드 확인 로그
//             data.exhibitions.forEach(exhibition => {
//                 const exhibitionElement = document.createElement('a');
//                 exhibitionElement.href = exhibition.url;
//                 exhibitionElement.innerHTML = `
//                     <div class="swiper-slide swiper-slide-active" style="width: 236.8px; margin-right: 24px">
//                         <div class="css-1pulbqw">
//                             <div class="css-3xk0il">
//                                 <img src="/upload/${exhibition.image}" class="preview">
//                             </div>
//                             <div class="css-qn01ot">
//                                 <div class="css-18m1pdx">${exhibition.title}</div>
//                             </div>
//                         </div>
//                     </div>
//                 `;
//                 exhibitionList.appendChild(exhibitionElement);
//             });
//             isLoading = false;
//         })
//         .catch(error => {
//             console.error('Error loading data:', error); // 오류 로드 확인 로그
//             isLoading = false;
//         });
//     }
// });
