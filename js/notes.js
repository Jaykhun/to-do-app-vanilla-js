import { addClass, createElement } from "./utils/domUtils.js"
import { redirectToPage } from "./utils/stateUtils.js"
import { clearData, getData } from "./utils/storageUtils.js"

class Notes {
    constructor() {
        this.initElements()
        this.init()
        this.logout()
        this.checkUserPermissions()
        this.addNote()
    }

    initElements() {
        // * Note 
        this.noteText = document.querySelector('#text')
        this.noteDate = document.querySelector('#date')
        this.noteImportant = document.querySelector('#importantBtn')
        this.noteSubmit = document.querySelector('#addBtn')
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
            const link = createElement('a', this.userMenu, 'Admin Panel')
            addClass([link], 'dropdown-item')
            link.addEventListener('click', () => redirectToPage('admin'))
        }
    }

    addNote(){
        const {noteDate, noteSubmit} = this

        noteSubmit.addEventListener('click', (e) => {
            e.preventDefault()

            
        })
    }
}

new Notes()