import { users } from '../data/storageUsers.js'
import { addClass } from './module/domUtils.js'
import { cancelFormItemsValue, formValidate, showPasswordValues } from './module/formUtils.js'
import { showMessage, showState } from './module/stateUtils.js'
import { getData, setData } from './module/storageUtils.js'

class Admin {
    constructor(data) {
        this.initElements()
        this.initUsers('users', data)
        this.addUser()
        this.showUsers(this.userList)
        this.deleteUser()
        this.editUser()
    }

    initElements() {
        // * Form
        this.login = document.querySelector('#login')
        this.password = document.querySelector('#password')
        this.confirm = document.querySelector('#confirm')
        this.submitBtn = document.querySelector('#submit')
        this.showPasswordBtn = document.querySelector('#btn-showPassword')
        this.makeAdminBtn = document.querySelector('#btn-makeAdmin')
        // * Users
        this.userList = document.querySelector('#userList')
        // * Modal
        this.modalBody = document.querySelector('#modalBody')
        // * Edit info
        this.changeLogin = document.querySelector('#changeLogin')
        this.changePass = document.querySelector('#changePassword')
        this.changeShowBtn = document.querySelector('#btn-edit-showPassword')
        this.changeMakeAdmin = document.querySelector('#btn-edit-makeAdmin')
        this.changeSubmit = document.querySelector('#change-save')
        this.changeModalClose = document.querySelector('#change-close')
        // * Permessions
        this.avialableWrap = document.querySelector('#availableWrap')
        this.activeWrap = document.querySelector('#activeWrap')
        this.allPerm = document.querySelector('#allPermissions')
    }

    initUsers(key, data) {
        if (!localStorage.key(key)) {
            setData(key, data)
        }
        const { showPasswordBtn, password, confirm, changeShowBtn, changePass } = this
        this.showPassword(showPasswordBtn, password, confirm)
        this.showPassword(changeShowBtn, changePass)
    }

    showPassword(showPasswordElement, password, confirm) {
        showPasswordElement.addEventListener('click', () => showPasswordValues([password, confirm]))
    }

    addUser() {
        const { login, password, confirm, showPasswordBtn, submitBtn, makeAdminBtn, userList, showUsers } = this

        const addNewUser = () => {
            const users = getData('users')
            const newUser = {
                login: login.value.toLowerCase().trim(),
                password: password.value.trim(),
                isAdmin: makeAdminBtn.checked,
                canEdit: true,
                canDelete: true,
                canAdd: true
            }

            const isUserExist = users.some(user => user.login === login.value.toLowerCase().trim())

            if (isUserExist) return showMessage('This account already exists')

            const isPasswordsMatch = password.value === confirm.value

            if (!isPasswordsMatch) {
                addClass([password, confirm], 'input-error')
                return showMessage("Password don't match")
            }

            const isFormValid = formValidate('_required')

            isFormValid
                ? (
                    users.push(newUser),
                    setData('users', users),
                    showUsers(userList),
                    cancelFormItemsValue([password, confirm, login], [showPasswordBtn, makeAdminBtn]),
                    showState('User added successffuly')
                )
                : showMessage('In each field must be at least four words')
        }

        submitBtn.addEventListener('click', addNewUser)
    }

    showUsers(userList) {
        const users = getData('users')
        const currentUser = getData('currentUser')
        userList.innerHTML = ''
        if (users.length > 1) {
            users.forEach((user, index) => {
                if (user.login !== 'admin' && user.login !== currentUser) {
                    userList.innerHTML += `
                    <li data-index ="${index}" data-name="${user.login}" class="users__item d-flex justify-content-between align-items-center mb-3 py-1">
                        <span class="user__name fw-normal text-capitalize fs-5 ${user.isAdmin ? 'text-warning' : ''}">${user.login}</span>
                        ${!user.isAdmin || currentUser === 'admin'
                            ? `<div class="user__buttons">
                                    <button data-action="delete" class="btn btn-danger btn-sm me-2">delete</button>
                                    <button data-action="edit" data-mdb-toggle="modal" data-mdb-target="#exampleModal" class="btn btn-info btn-sm">edit</button>
                                </div>`
                            : ''
                        }
                    </li>`
                }
            })
        }

        else {
            userList.innerHTML = '<li class="users__item fw-normal text-danger fs-5 text-center my-4"><span>There are no users</span></li>'
        }
    }

    deleteUser() {
        const { userList, showUsers } = this
        userList.addEventListener('click', (event) => {
            if (event.target.getAttribute('data-action') === 'delete') {
                const users = getData('users')
                const userName = event.target.closest('li').getAttribute('data-name')
                const filteredUsers = users.filter(user => user.login !== userName)

                setData('users', filteredUsers)
                showUsers(this.userList)
            }
        })
    }


    editUser() {
        this.userList.addEventListener('click', (event) => {
            if (event.target.getAttribute('data-action') === 'edit') {
                const userIndex = event.target.closest('li').getAttribute('data-index')
                this.userPermissions(userIndex)
            }
        })
    }

    userPermissions(index) {
        this.users = getData('users')
        this.currentUser = this.users[index]

        this.showUserInfo()
        this.dragPermissions()
        this.saveChanges(index)
    }

    showUserInfo() {
        const { changeLogin, changePass, changeMakeAdmin, activeWrap, avialableWrap, currentUser } = this

        changeLogin.value = currentUser.login
        changePass.value = currentUser.password
        changeMakeAdmin.checked = currentUser.isAdmin

        avialableWrap.innerHTML = ''
        activeWrap.innerHTML = '';

        ['canEdit', 'canDelete', 'canAdd'].forEach(permission => {
            if (currentUser[permission]) {
                avialableWrap.innerHTML +=
                    `<button draggable="true" data-action="${permission}" data-permission="${currentUser[permission] ? 'active' : 'notActive'}" 
                    class="btn btn-sm btn-warning">${permission}</button>`
            }
            else {
                activeWrap.innerHTML +=
                    `<button draggable="true" data-action="${permission}" class="btn btn-sm btn-warning">${permission}</button>`
            }
        })
    }

    saveChanges(index) {
        const { changeSubmit, changeLogin, changePass, changeMakeAdmin, showUsers, userList, users } = this

        const handleSave = () => {
            const isFormValid = formValidate('_change-required')

            isFormValid
                ? (
                    users[index].login = changeLogin.value.toLowerCase().trim(),
                    users[index].password = changePass.value.trim(),
                    users[index].isAdmin = changeMakeAdmin.checked,
                    setData('users', users),
                    showUsers(userList),
                    showState('Successfully changed')
                )
                : showState('In each field must be at least four words')
        }

        changeSubmit.addEventListener('click', () => handleSave())
    }

    dragPermissions() {
        const { activeWrap, avialableWrap, allPerm } = this
        avialableWrap.ondragover = this.allowDrop
        activeWrap.ondragover = this.allowDrop
        activeWrap.addEventListener('drop', (event) => this.drop(event))
        avialableWrap.addEventListener('drop', (event) => this.drop(event))
        allPerm.addEventListener('dragstart', (event) => this.drag(event))
    }

    allowDrop(event) {
        event.preventDefault()
    }

    changeState(list, action) {
        if (list.getAttribute('data-permission') == 'active') {
            this.currentUser[action] = true
        }
        else if (list.getAttribute('data-permission') == 'notActive') {
            this.currentUser[action] = false
        }
    }

    drag(event) {
        let item = event.target.closest('button')
        if (!item) return
        item.setAttribute('id', `${new Date().getTime()}`)
        event.dataTransfer.setData('id', item.getAttribute('id'))
        event.dataTransfer.setData('action', item.getAttribute('data-action'))
    }

    drop(event) {
        let itemId = event.dataTransfer.getData('id')
        let action = event.dataTransfer.getData('action')

        let list = event.target.closest('div')
        list.append(document.getElementById(itemId))
        this.changeState(list, action)
    }
}

new Admin(users)