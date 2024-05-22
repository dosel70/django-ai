const buttons = document.querySelectorAll('button.major-btn span');
buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
        const activeBtn = document.querySelector("button.active-btn")
        if(activeBtn){
            activeBtn.classList.toggle("active-btn");
        }
        button.parentElement.classList.toggle("active-btn");
    });
});


// 좋아요
const likeBtns = document.querySelectorAll('.like-btn')
likeBtns.forEach((likeBtn) => {
    likeBtn.addEventListener('click', function(e) {
        likeBtn.classList.toggle('active')
    })
})

const onelabList = document.querySelectorAll('div.table-layout-container');
const moreBtn = document.querySelectorAll('.get-more-result-btn');

moreBtn.forEach(btn => {
    btn.addEventListener("click", (e) => {
        onelabList.forEach(list => {
            list.style.display = 'grid';
        });
    });
});
