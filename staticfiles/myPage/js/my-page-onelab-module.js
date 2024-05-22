// 양현 작업

const myPageOnelabService = (() => {
    // isMember === true: 랩원 기준 조회
    // isMember === false: 랩장 기준 조회
    const getList = async (isMember, callback) => {
        const response = await fetch(`/myPage/onelab/api?is-member=${isMember}`);
        const onelabList = await response.json();
        if (callback) {
            callback(onelabList)
        }
    }

    return {getList: getList}
})();