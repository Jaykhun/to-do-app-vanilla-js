import { addClass, createElement, removeClass } from "./utils/domUtils.js"
import { formValidate, cancelFormItemsValue } from './utils/formUtils.js'
import { redirectToPage, showState } from "./utils/stateUtils.js"
import { clearData, getData, setData } from "./utils/storageUtils.js"
import { sortDate } from "./utils/dateUtils.js"

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
        this.completeNote()
        this.searchNote()
        this.filterNote()
    }

    initElements() {
        // * Note 
        this.noteText = document.querySelector('#text')
        this.noteDate = document.querySelector('#date')
        this.noteImportant = document.querySelector('#importantBtn')
        this.noteSubmit = document.querySelector('#addBtn')
        this.noteSearch = document.querySelector('#search')
        this.notesBody = document.querySelector('#notesBody')
        this.notesForm = document.querySelector('.notes-form')
        this.noteFilter = document.querySelector('.select')
        // * User
        this.userName = document.querySelector('.user_name')
        // * Menu
        this.logoutBtn = document.querySelector('#logout')
        this.myProfileBtn = document.querySelector('#myProfile')
        this.userMenu = document.querySelector('#permissons')
    }

    init() {
        const { userName, notesForm } = this
        const currentUser = getData('users').find(user => user.login === getData('currentUser'))
        currentUser
            ? userName.innerHTML = currentUser.login
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
        const currentUser = getData('users').find(user => user.login === getData('currentUser'))
        if (currentUser && currentUser.isAdmin) {
            const link = createElement('a', this.userMenu, 'Admin Panel')
            addClass([link], 'dropdown-item')
            link.addEventListener('click', () => redirectToPage('admin'))
        }
    }

    showNotes(notesBody) {
        const notes = getData('notes')
        const users = getData('users')
        const currentUser = getData('currentUser')
        const user = users.find(user => user.login === currentUser)
        notesBody.innerHTML = ''
        notes.forEach((note, index) => {
            if (note.author === currentUser || user.isAdmin) {
                notesBody.innerHTML += `
                <div data-index=${index} data-author=${note.author} data-action='complete' class="notes__item ${note.completed ? 'completed' : ''} ${note.important ? 'important' : ''} item d-flex justify-content-between align-items-center p-2">
                    <div class="item__content d-flex align-items-center gap-2 pe-none ${note.completed ? 'note-done' : ''}"> 
                        <span class="item__circle ${note.important ? 'bg-danger' : 'bg-warning'} ${note.completed ? 'done' : ''}"></span>
                        <p class="item__name">${note.date} / <span class="text-black fw-bold">${user.isAdmin ? note.author : ''}</span> </p>
                        <p class="item__name">${note.text}</p>
                    </div>
    
                    <div class="item__actions">
                        ${user.canEdit ? `<button class="btn btn-primary" data-action='edit'>Edit</button>` : ''}
                        ${user.canDelete ? `<button class="btn btn-danger" data-action='delete'>Delete</button>` : ''}
                    </div>
                </div>
                `
            }
        })

        if (!notes.length) {
            notesBody.innerHTML = `<div class="text-danger fw-bold text-center">There are no notes</div>`
        }
    }

    addNote() {
        const { noteDate, noteSubmit, noteImportant, noteText, showNotes } = this

        const addNote = () => {
            const notes = getData('notes')
            const currentUser = getData('currentUser')
            let date

            !noteDate.value
                ? date = sortDate()
                : date = noteDate.value

            const newNote = {
                author: currentUser,
                important: noteImportant.checked,
                completed: false,
                text: noteText.value,
                date: date
            }

            const isFormValid = formValidate('_required')

            isFormValid
                ? (
                    notes.push(newNote),
                    setData('notes', notes),
                    showNotes(this.notesBody),
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
                this.showNotes(this.notesBody)
            }
        })
    }

    editNote() {

    }

    completeNote() {
        this.notesBody.addEventListener('click', (e) => {
            if (e.target.getAttribute('data-action') === 'complete') {
                const notes = getData('notes')
                const currentNote = e.target
                const noteIndex = currentNote.getAttribute('data-index')
                notes[noteIndex].completed = !notes[noteIndex].completed

                showState('Successfully changed')
                setData('notes', notes)
                this.showNotes(this.notesBody)
            }
        })
    }

    searchNote() {
        this.noteSearch.addEventListener('keyup', () => {
            let value = this.noteSearch.value.toLowerCase()
            const notesName = document.querySelectorAll('.item__name')
            notesName.forEach(e => {
                const itemContent = e.parentNode.parentNode
                e.innerText.toLowerCase().search(value.trim()) == -1
                    ? addClass([itemContent], 'd-none')
                    : removeClass([itemContent], 'd-none')
            })
        })
    }

    filterNote() {
        const addFunc = (note) => {
            addClass([note], 'd-flex')
            removeClass([note], 'd-none')
        }

        const delFunc = (note) => {
            addClass([note], 'd-none')
            removeClass([note], 'd-flex')
        }

        this.noteFilter.addEventListener('click', (e) => {
            const notes = this.notesBody.children
            for (const note of notes) {
                switch (e.target.value) {
                    case 'all':
                        addFunc(note)
                        break
                    case 'done':
                        note.classList.contains('completed')
                            ? addFunc(note)
                            : delFunc(note)
                        break
                    case 'important':
                        note.classList.contains('important')
                            ? addFunc(note)
                            : delFunc(note)
                        break
                }
            }
        })
    }
}

new Notes()