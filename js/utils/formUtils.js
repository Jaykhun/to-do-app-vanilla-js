import { addClass, removeClass } from "./domUtils.js"

const cancelFormItemsValue = (formItems, checkboxItems) => {
    formItems.forEach(item => item.value = '')
    checkboxItems.forEach(item => item.checked = false)
}

const showPasswordValues = (input) => {
    input.forEach(item => {
        if(item){
            item.type === 'password'
                ? item.type = 'text'
                : item.type = 'password'
        }
    })
}

const formValidate = (reqClass) => {
    const formReq = document.querySelectorAll(`.${reqClass}`);
    let IsError = true;

    formReq.forEach(input => {
        if (input.value.trim().length < 3) {
            addClass([input], 'input-error')
            IsError = false
        }

        else removeClass([input], 'input-error')
    })

    return IsError;
};


export { cancelFormItemsValue, formValidate, showPasswordValues }

