import { users } from '../data/storageUsers.js'
import { cancelFormItemsValue } from './module/formUtils.js';
import { getData, setData } from './module/storageUtils.js'
import { showMessage, redirectToPage } from './module/stateUtils.js'
import { addClass } from './module/domUtils.js';

class Auth {
    constructor(data) {
        this.initUsers('users', data);
        this.initElements();
        this.checkUserInfo();
        this.redirectToRegister();
        this.showPassword()
    }

    initElements() {
        this.login = document.querySelector('#login');
        this.password = document.querySelector('#password');
        this.submit = document.querySelector('#btn-submit');
        this.showPasswordBtn = document.querySelector('#btn-showPassword')
        this.redirectLink = document.querySelector('#redirectLink')
    }

    initUsers(key, data) {
        if (!localStorage.key(key)) {
            setData(key, data)
        }
    }

    showPassword() {
        const { showPasswordBtn, password } = this

        showPasswordBtn.addEventListener('click', () => {
            showPasswordBtn.checked
                ? password.type = 'text'
                : password.type = 'password'
        })
    }

    redirectToRegister() {
        const { login, password, showPasswordBtn, redirectLink } = this

        redirectLink.addEventListener('click', () => {
            redirectToPage('sign-up');
            cancelFormItemsValue([login, password], showPasswordBtn);
        })
    }

    checkUserInfo() {
        const { login, password, submit, showPasswordBtn } = this
        let signIn = false

        const checkPassword = () => {
            getData('users').forEach(user => {
                if (user.login === login.value.toLowerCase() && user.password === password.value) {
                    signIn = true
                    cancelFormItemsValue([login, password], [showPasswordBtn])
                    setData('currentUser', user.login)
                    redirectToPage('notes')
                }

                else { addClass([login, password], 'input-error') }
            })

            if (!signIn) showMessage('Incorrect login or password')
        }

        submit.addEventListener('click', checkPassword)
    }
}

new Auth(users)