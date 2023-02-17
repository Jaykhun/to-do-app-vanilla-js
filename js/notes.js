import { addClass, createElement } from "./module/domUtils.js"
import { redirectToPage } from "./module/stateUtils.js"
import { clearData, getData } from "./module/storageUtils.js"

class Notes {
    constructor() {
        this.initElements()
        this.init()
        this.logout()
        this.checkUserPermissions()
    }

    initElements() {
        // * Note 
        this.noteText = document.querySelector('#text')
        this.noteDate = document.querySelector('#date')
        this.noteImportant = document.querySelector('#importantBtn')
        this.noteAdd = document.querySelector('#addBtn')
        this.noteSearch = document.querySelector('#search')
        // * User
        this.userName = document.querySelector('.user_name')
        // * Menu
        this.logoutBtn = document.querySelector('#logout')
        this.myProfileBtn = document.querySelector('#myProfile')
        this.userMenu = document.querySelector('#permissons')
    }

    init() {
        const {userName} = this
        const currentUser = getData('currentUser')
        currentUser
            ? userName.innerHTML = currentUser
            : document.body.innerHTML = '<p class="text-center my-4 fw-bold">Please first sign in</p>'
    }

    logout() {
        this.logoutBtn.addEventListener('click', () => {
            clearData('currentUser')
            redirectToPage('index')
        })
    }

    checkUserPermissions() {
        const currentUser = getData('users').filter(user => user.login === getData('currentUser'))
        if (currentUser && currentUser[0].isAdmin) {
            const link = createElement('a', this.userMenu, 'Permissions')
            addClass([link], 'dropdown-item')
            link.addEventListener('click', () => redirectToPage('admin'))
        }
    }
}

new Notes()