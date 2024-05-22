const alarmModuleService = (() => {
    const pageNation = async (page, callback) => {
        const pageNationResponse = await fetch(`api/${page}`)
        const pageNationNewInfo = await pageNationResponse.json()
        if(callback){
            callback(pageNationNewInfo)
        }
        return pageNationNewInfo
    }

    const oneLabAgree = async (alarmClickId, alarmClickValue, callback) => {
        const response = await fetch(`agree/api/`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-CSRFToken':csrf_token
            },
            body: JSON.stringify(({
                alarmClickId: alarmClickId,
                buttonResult: alarmClickValue
            }))
        })
        const alarmResult = await response.json()
        if(callback){
            return callback(alarmResult)
        }
        return alarmResult
    }

    const oneLabDeny = async (alarmClickId, alarmClickValue, callback) => {
        const response = await fetch(`deny/api/`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-CSRFToken':csrf_token
            },
            body: JSON.stringify(({
                alarmClickId: alarmClickId,
                buttonResult: alarmClickValue
            }))
        })
        const alarmResult = await response.json()
        if(callback){
            return callback(alarmResult)
        }
        return alarmResult
    }

    const oneLabCancel = async (alarmClickId, alarmClickValue, callback) => {
        const response = await fetch(`cancel/api/`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-CSRFToken':csrf_token
            },
            body: JSON.stringify(({
                alarmClickId: alarmClickId,
                buttonResult: alarmClickValue
            }))
        })
        const alarmResult = await response.json()
        if(callback){
            return callback(alarmResult)
        }
        return alarmResult
    }

    return {
        pageNation:pageNation,
        oneLabAgree:oneLabAgree,
        oneLabDeny:oneLabDeny,
        oneLabCancel:oneLabCancel
    }
})();