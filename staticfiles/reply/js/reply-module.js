const replyService = (() => {
    const write = async (reply) => {
        const response = await fetch("/replies/write/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-CSRFToken': csrf_token
            },
            body: JSON.stringify(reply)
        });
    }

    const getList = async (community_id, page, callback) => {
        const response = await fetch(`/replies/list/${community_id}/${page}`);
        const replies = await response.json();
        if(callback){
            return callback(replies);
        }
        return replies;
    }

    const remove = async (replyId) => {
        await fetch(`/replies/${replyId}/`, {
            method: 'delete',
            headers: {'X-CSRFToken': csrf_token}
        });
    }

    const update = async (reply) => {
        await fetch(`/replies/${reply.replyId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-CSRFToken': csrf_token
            },
            body: JSON.stringify({'reply_content': reply.replyContent})
        });
    }

    return {write: write, getList: getList, remove: remove, update: update}
})();
















