import { users } from '../data/storageUsers.js'
import { addClass } from './module/domUtils.js'
import { cancelFormItemsValue, formValidate, showPasswordValues } from './module/formUtils.js'
import { redirectToPage, showState } from './module/stateUtils.js'
import { getData, setData } from './module/storageUtils.js'

class Registration {
    constructor(data) {
        this.initElements();
        this.initUsers('users', data);
        this.addUser();
        this.showPassword();
        this.redirectToAuth();
    }

    initElements() {
        this.login = document.querySelector('#login');
        this.password = document.querySelector('#password');
        this.confirm = document.querySelector('#confirm');
        this.submitBtn = document.querySelector('#submit');
        this.showPasswordBtn = document.querySelector('#btn-showPassword');
        this.redirectLink = document.querySelector('#redirectLink');
    }

    initUsers(key, data) {
        if (!localStorage.key(key)) {
            setData(key, data)
        }
    }

    showPassword() {
        const { password, confirm, showPasswordBtn } = this

        showPasswordBtn.addEventListener('click', () => showPasswordValues([password, confirm]))
    }

    redirectToAuth() {
        const { login, password, confirm, showPasswordBtn, redirectLink } = this

        redirectLink.addEventListener('click', () => {
            redirectToPage('index')
            cancelFormItemsValue([password, confirm, login], showPasswordBtn)
        })
    }

    addUser() {
        const { login, password, confirm, showPasswordBtn, submitBtn } = this
        const users = getData('users');

        const addNewUser = () => {
            const newUser = {
                login: login.value.toLowerCase(),
                password: password.value,
                isAdmin: false,
                canEdit: true,
                canDelete: true,
                canAdd: true
            }

            const isUserExist = getData('users').some(user => user.login === login.value.toLowerCase())
            const isFormValid = formValidate('_required')
            const isPasswordsMatch = password.value === confirm.value

            if (isUserExist) {
                return showState('This account already exists')
            }

            if (!isPasswordsMatch) {
                addClass([password, confirm], 'input-error')
                return showState("Password don't match")
            }

            isFormValid
                ? (
                    users.push(newUser),
                    setData('users', users),
                    setData('currentUser', newUser.login),
                    redirectToPage('notes'),
                    cancelFormItemsValue([password, confirm, login], [showPasswordBtn])
                )
                : showState('In each field must be at least four words')
        }

        submitBtn.addEventListener('click', addNewUser)
    }
}

new Registration(users)