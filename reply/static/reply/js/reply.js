// let page= 1
//
// const showList = (replies) => {
//     console.log(replies);
// }
//
// const writeButton = document.getElementById("reply-write");
// writeButton.addEventListener("click",(e) => {
//     const replyContent = document.querySelector(".comment-textarea")
//     replyService.write(replyContent.value)
// // 목록을 다시 조회해서 화면에 출력
//     replyService.getList(showList)
//
// });
//
// replyService.getList(community_id, page, showList)




let page = 1;

const writeButton = document.getElementById("reply-write");
const ul = document.querySelector("#replies-wrap ul");
const moreButton = document.getElementById("more-replies");

replyService.getList(community_id, page + 1).then((replies) => {
    if (replies.length !== 0){
        moreButton.style.display = "";
        // moreButton.style.display = "text-align: center";
    }
});

const showList = (replies) => {
    let text = ``;
    replies.forEach((reply) => {
        text += `
            <li>
                <div>
                    <div class="comment-user-wrapper-container">
                        <div class="comment-user-wrapper-avatar">
                            <!-- a태그 클릭시 해당 댓글 작성 회원의 마이페이지 이동 -->
                            <a href="">
                                <div class="avatar" style="width: 36px; height: 36px;">
                                    <span class="avatar-has-image">
                                        <img src="/upload/${reply.member_path}" width="15px">
                                    </span>
                                </div>
                            </a>
                        </div>
                        <div class="comment-user-wrapper-main">
                            <div class="comment-user-info-container">
                                <span class="comment-user-info-name">
                                    <a href="">
                                        <strong>${reply.member_name}</strong>
                                    </a>
                                </span>
                                <span class="comment-user-info-date">${timeForToday(reply.created_date)}</span>
                            </div>
                            <div>
                                <div class="comment-text-content-container">
                                    <div class="comment-text-content-box"> 
                                        <span class="title">${reply.reply_content}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        `;
    });
    return text;
}

moreButton.addEventListener("click", (e) => {
    replyService.getList(community_id, ++page, showList).then((text) => {
        ul.innerHTML += text;
    });

    replyService.getList(community_id, page + 1).then((replies) => {
    if (replies.length === 0){
        moreButton.style.display = "none";
    }
});

});

writeButton.addEventListener("click", async (e) => {
    const replyContent = document.getElementById("reply-content");
    await replyService.write({
        reply_content: replyContent.value,
        community_id: community_id
    });
    replyContent.value = "";

    page = 1
    const text = await replyService.getList(community_id, page, showList);
    ul.innerHTML = text;

    const replies = await replyService.getList(community_id, page + 1);
    if (replies.length !== 0){
        moreButton.style.display = "";
    }
});

replyService.getList(community_id, page, showList).then((text) => {
    ul.innerHTML = text;
});

// ul 태그의 자식 태그까지 이벤트가 위임된다.
ul.addEventListener("click", async (e) => {
    if(e.target.classList[0] === 'update'){
        const replyId = e.target.classList[1]
        const updateForm = document.getElementById(`update-form${replyId}`)

        updateForm.style.display = "block";
        updateForm.previousElementSibling.style.display = "none";

    }else if(e.target.classList[0] === 'calcel'){
        const replyId = e.target.classList[1]
        const updateForm = document.getElementById(`update-form${replyId}`)
        updateForm.style.display = "none";
        updateForm.previousElementSibling.style.display = "block";

    }else if(e.target.classList[0] === 'update-done'){
        const replyId = e.target.classList[1]
        const replyContent = document.querySelector(`#update-form${replyId} textarea`);
        await replyService.update({replyId: replyId, replyContent: replyContent.value})
        page = 1
        const text = await replyService.getList(community_id, page, showList);
        ul.innerHTML = text;
        const replies = await replyService.getList(community_id, page + 1);
        if (replies.length !== 0){
            moreButton.style.display = "";
        }

    }else if(e.target.classList[0] === 'delete'){
        const replyId = e.target.classList[1];
        await replyService.remove(replyId);
        page = 1
        const text = await replyService.getList(community_id, page, showList);
        ul.innerHTML = text;

        const replies = await replyService.getList(community_id, page + 1);
        if (replies.length !== 0){
            moreButton.style.display = "";
        }
    }
});

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