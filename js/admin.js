import { users } from '../data/storageUsers.js'
import { addClass } from './module/domUtils.js';
import { showMessage } from './module/stateUtils.js';
import { getData, setData } from './module/storageUtils.js'
import { cancelFormItemsValue, showPasswordValues, formValidate } from './module/formUtils.js';

class Admin {
    constructor(data) {
        this.initElements();
        this.initUsers('users', data);
        this.addUser();
        this.showUsers(this.userList);
        this.showPassword();
        this.deleteUser();
    }

    initElements() {
        // * Form
        this.login = document.querySelector('#login');
        this.password = document.querySelector('#password');
        this.confirm = document.querySelector('#confirm');
        this.submitBtn = document.querySelector('#submit');
        this.showPasswordBtn = document.querySelector('#btn-showPassword');
        this.makeAdminBtn = document.querySelector('#btn-makeAdmin');
        // * Users
        this.userList = document.querySelector('#userList');
        // * Modal
        this.modalBody = document.querySelector('#modalBody');
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

    addUser() {
        const { login, password, confirm, showPasswordBtn, submitBtn, makeAdminBtn, userList, showUsers } = this
        const users = getData('users');

        const addNewUser = () => {
            const newUser = {
                login: login.value.toLowerCase(),
                password: password.value,
                isAdmin: makeAdminBtn.checked,
                canEdit: true,
                canDelete: true,
                canAdd: true
            }

            const isUserExist = users.some(user => user.login === login.value.toLowerCase())

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
                    cancelFormItemsValue([password, confirm, login], [showPasswordBtn, makeAdminBtn])
                )
                : showMessage('In each field must be at least four words')
        }

        submitBtn.addEventListener('click', addNewUser)
    }

    showUsers(userList) {
        const users = getData('users');
        const currentUser = getData('currentUser');
        userList.innerHTML = '';
        if (users.length > 1) {
            users.forEach(user => {
                if (user.login !== 'admin') {
                    userList.innerHTML += `
                    <li data-name ="${user.login}" class="users__item d-flex justify-content-between align-items-center mb-3 py-1">
                        <span class="user__name fw-normal text-capitalize fs-5 ${user.isAdmin ? 'text-warning' : ''}">${user.login}</span>
                        <div class="user__buttons">
                        ${currentUser === 'admin'
                            ? '<button data-action="delete" class="btn btn-danger btn-sm me-2">delete</button>'
                            : ''
                        }
                        <button data-mdb-toggle="modal" data-mdb-target="#exampleModal" class="btn btn-info btn-sm">edit</button>
                        </div>
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
                const users = getData('users');
                const userName = event.target.closest('li').getAttribute('data-name');
                const filteredUsers = users.filter(user => user.login !== userName)

                setData('users', filteredUsers)
                showUsers(this.userList)
            }
        })
    }


    editUser() {
        const { userList, showUsers } = this
        userList.addEventListener('click', (event) => {
            if (event.target.getAttribute('data-action') === 'edit') {
                const users = getData('users');
                const userName = event.target.closest('li').getAttribute('data-name');
                const currentUsers = users.filter(user => user.login === userName)


            }
        })
    }


    showUserPermissions() {

    }
}

new Admin(users)