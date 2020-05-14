import '../node_modules/muicss/dist/js/mui.js'
import {Question} from './Question';
import {isValid, createModal} from './utils';
import {authWithEmailAndPassword, getAuthForm} from './auth';
import './style/main.scss'

const $form = document.querySelector('#form')
const $btnModal = document.querySelector('#modal-btn')
const $input = $form.querySelector('#question-input')
const $btnSubmit = $form.querySelector('#submit')

window.addEventListener('load', Question.renderList)
$form.addEventListener('submit', submitFormHandler)
$input.addEventListener('input', () => $btnSubmit.disabled = !isValid($input.value))
$btnModal.addEventListener('click', openModal)

function submitFormHandler(event) {
    event.preventDefault()
    if (isValid($input.value)) {
        const question = {
            text: $input.value.trim(),
            date: new Date().toJSON()
        }
        $btnSubmit.disabled = true
        Question.create(question).then(() => {
            $input.value = ''
            $input.className = ''
        })
    }
}

function openModal() {
    createModal('Авторизация', getAuthForm())
    document
        .querySelector('#auth-form')
        .addEventListener('submit', authFormHandler, {once: true})
}

function authFormHandler(event) {
    event.preventDefault()

    const $btn = event.target.querySelector('button')
    const email = document.querySelector('#email').value
    const password = document.querySelector('#password').value
    $btn.disabled = true

    authWithEmailAndPassword(email, password)
        .then(Question.fetch)
        .then(renderModalAfterAuth)
        .then(() => $btn.disabled = false)
}

function renderModalAfterAuth(content) {
    if (typeof content === 'string') {
        createModal('Ошибка!', content)
    } else {
        createModal('Список вопросов', Question.listToHTML(content))
    }
}