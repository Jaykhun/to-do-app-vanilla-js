import { addClass, createElement } from "./utils/domUtils.js"
import { formValidate } from './utils/formUtils.js'
import { redirectToPage, showState } from "./utils/stateUtils.js"
import { clearData, getData, setData } from "./utils/storageUtils.js"

class Notes {
    constructor() {
        this.initElements()
        this.init()
        this.logout()
        this.checkUserPermissions()
        this.addNote()
        this.showNotes(this.notesBody)
        this.deleteNote()
        this.editNote()
        this.searchNote()
    }

    initElements() {
        // * Note 
        this.noteText = document.querySelector('#text')
        this.noteDate = document.querySelector('#date')
        this.noteImportant = document.querySelector('#importantBtn')
        this.noteSubmit = document.querySelector('#addBtn')
        this.noteSearch = document.querySelector('#search')
        this.notesBody = document.querySelector('#notesBody')
        // * User
        this.userName = document.querySelector('.user_name')
        // * Menu
        this.logoutBtn = document.querySelector('#logout')
        this.myProfileBtn = document.querySelector('#myProfile')
        this.userMenu = document.querySelector('#permissons')
    }

    init() {
        const { userName } = this
        const currentUser = getData('currentUser')
        currentUser
            ? userName.innerHTML = currentUser
            : document.body.innerHTML = '<p class="text-center my-4 fw-bold">Please first sign in</p>'

        if (!localStorage.getItem('notes')) {
            setData('notes', [])
        }
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

    showNotes() {
        const notes = getData('notes')
        const currentUser = getData('currentUser')
        this.notesBody.innerHTML = ''
        notes.forEach((note, index) => {
            this.notesBody.innerHTML += `
            <div data-index=${index} data-author=${note.author} class="notes__item item d-flex justify-content-between align-items-center p-2">
                <span class="item__circle ${note.important ? 'bg-danger' : 'bg-warning'} ${note.completed ? 'bg-success' : ''}"></span>
                <p class="item__name">${note.text}</p>

                <div class="item__actions">
                    <button class="btn btn-primary" data-action='edit'>Edit</button>
                    <button class="btn btn-danger" data-action='delete'>Delete</button>
                </div>
            </div>
            `
        })
    }

    addNote() {
        const { noteDate, noteSubmit, noteImportant, noteText, showNotes } = this

        const addNote = () => {
            const notes = getData('notes')
            const currentUser = getData('currentUser')

            const newNote = {
                author: currentUser,
                important: noteImportant.checked,
                completed: false,
                text: noteText.value,
                date: noteDate.value
            }

            const isFormValid = formValidate('_required')

            isFormValid
                ? (
                    notes.push(newNote),
                    setData('notes', notes),
                    showNotes(),
                    cancelFormItemsValue([noteDate, noteText], [noteImportant]),
                    showState('Note added')
                )
                : showState('In each field must be at least four words')
        }

        noteSubmit.addEventListener('click', (e) => {
            e.preventDefault()
            addNote()
        })
    }

    deleteNote() {
        this.notesBody.addEventListener('click', (e) => {
            if (e.target.getAttribute('data-action') === 'delete') {
                const notes = getData('notes')
                const noteIndex = e.target.closest('.notes__item').getAttribute('data-index')
                notes.splice(noteIndex, 1)
                
                showState('Successfully deleted')
                setData('notes', notes)
                this.showNotes()
            }
        })
    }

    editNote() {

    }

    searchNote() {
        this.noteSearch.addEventListener('keyup', () => {
            let value = this.noteSearch.value.toLowerCase()
            const notesName = document.querySelectorAll('.item__name')
            notesName.forEach(e => {
                const itemContent = e.parentNode
                e.innerText.toLowerCase().search(value) == -1
                    ? itemContent.classList.add('d-none')
                    : itemContent.classList.remove('d-none')
            })
        })
    }
}

new Notes()