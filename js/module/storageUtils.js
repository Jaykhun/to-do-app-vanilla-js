const getData = (key) => JSON.parse(localStorage.getItem(key));

const setData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const clearData = (key) => localStorage.removeItem(key);

export {
    getData,
    setData,
    clearData,
}