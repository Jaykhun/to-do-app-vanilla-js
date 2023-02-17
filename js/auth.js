import { users } from '../data/storageUsers.js'
import { addClass } from './module/domUtils.js'
import { cancelFormItemsValue } from './module/formUtils.js'
import { redirectToPage, showState } from './module/stateUtils.js'
import { getData, setData } from './module/storageUtils.js'

class Auth {
    constructor(data) {
        this.initUsers('users', data)
        this.initElements()
        this.checkUserInfo()
        this.redirectToRegister()
        this.showPassword()
        this.showAdmins()
    }

    initElements() {
        this.login = document.querySelector('#login')
        this.password = document.querySelector('#password')
        this.submit = document.querySelector('#btn-submit')
        this.showPasswordBtn = document.querySelector('#btn-showPassword')
        this.redirectLink = document.querySelector('#redirectLink')
        //* accardion menu
        this.superAdminBlock = document.querySelector('#super-admin')
        this.adminBlock = document.querySelector('#admin')
    }

    initUsers(key, data) {
        if (!localStorage.key(key)) {
            setData(key, data)
        }
    }

    showAdmins() {
        const { superAdminBlock, adminBlock } = this
        const users = getData('users')

        superAdminBlock.innerHTML = ''
        adminBlock.innerHTML = ''

        const userItem = (login, password) =>
            `<div class="users__info mb-2">
                <div class="login">Login: <span class="userLogin">${login}</span></div>
                <div class="password">Password: <span class="userPass">${password}</span></div>
            </div>
            `

        let flag = false
        users.forEach(user => {
            if (user.login === 'admin') {
                superAdminBlock.innerHTML +=
                    userItem(user.login, user.password)
            }

            else if (user.isAdmin === true && user.login !== 'admin') {
                adminBlock.innerHTML += userItem(user.login, user.password)
                flag = true
            }
        })

        !flag
            ? adminBlock.innerHTML = 'There are no admin users'
            : ''
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
            redirectToPage('sign-up')
            cancelFormItemsValue([login, password], showPasswordBtn)
        })
    }

    checkUserInfo() {
        const { login, password, submit, showPasswordBtn } = this
        let signIn = false

        const checkPassword = () => {
            getData('users').forEach(user => {
                if (user.login === login.value.trim() && user.password === password.value.trim()) {
                    signIn = true
                    cancelFormItemsValue([login, password], [showPasswordBtn])
                    setData('currentUser', user.login)
                    redirectToPage('notes')
                }

                else { addClass([login, password], 'input-error') }
            })

            if (!signIn) showState('Incorrect login or password')
        }

        submit.addEventListener('click', checkPassword)
    }
}

new Auth(users)