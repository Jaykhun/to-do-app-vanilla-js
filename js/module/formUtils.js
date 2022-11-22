import { addClass, removeClass } from "./domUtils.js"

const cancelFormItemsValue = (formItems, checkbox) => {
    formItems.forEach(item => item.value = '')
    checkbox ? checkbox.checked = false : null
}

const showPasswordValues = (input) => {
    input.forEach(item =>
        item.type === 'password'
            ? item.type = 'text'
            : item.type = 'password'
    )
}

const formValidate = (reqClass) => {
    const formReq = document.querySelectorAll(`.${reqClass}`);
    let error = true;

    formReq.forEach(input => {
        if (input.value.trim().length < 3) {
            addClass([input], 'input-error')
            error = false
        }

        else removeClass([input], 'input-error')
    })

    return error;
};


export { cancelFormItemsValue, showPasswordValues, formValidate }