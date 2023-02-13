import { addClass, createElement } from "./module/domUtils.js";
import { redirectToPage } from "./module/stateUtils.js"
import { clearData, getData } from "./module/storageUtils.js"

class Notes {
    constructor() {
        this.init();
        this.initElements();
        this.logout();
        this.myProfile();
        this.checkUserPermissions();
    }

    init() {
        const currentUser = getData('currentUser');
        if (!currentUser) {
            document.body.innerHTML = '<p class="text-center my-4 fw-bold">Please first sign in</p>'
        }
    }

    initElements() {
        // * Note 
        this.noteText = document.querySelector('#text');
        this.noteDate = document.querySelector('#date');
        this.noteImportant = document.querySelector('#importantBtn');
        this.noteAdd = document.querySelector('#addBtn');
        this.noteSearch = document.querySelector('#search')
        // * Menu
        this.logoutBtn = document.querySelector('#logout');
        this.myProfileBtn = document.querySelector('#myProfile')
        this.userMenu = document.querySelector('#permissons');
        // * 
    }

    logout() {
        this.logoutBtn.addEventListener('click', () => {
            clearData('currentUser')
            redirectToPage('index')
        })
    }

    myProfile() {

    }

    checkUserPermissions() {
        const currentUser = getData('users').filter(user => user.login === getData('currentUser'))
        if (currentUser && currentUser[0].isAdmin) {
            const link = createElement('a', this.userMenu, 'Permissions');
            addClass([link], 'dropdown-item')
            link.addEventListener('click', () => redirectToPage('admin'))
        }
    }
}

new Notes()