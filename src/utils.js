const saveToLocalStorage=(key,array)=>{
    localStorage.setItem(key,JSON.stringify(array))
}

const getFromLocalStorage=(key)=>{
    const retrivedArray=JSON.parse(localStorage.getItem(key))
    return retrivedArray
}

export {
    saveToLocalStorage,
    getFromLocalStorage
}