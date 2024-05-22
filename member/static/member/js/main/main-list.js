let page = 1
const getList = (callback) => {
    fetch(`http://127.0.0.1:10000/${page}`)
    .then((response) => response.json())
    .then(() => {
        if(callback){
            callback(exhibitions)
        }
    })
}

getList()