import '../node_modules/muicss/dist/js/mui.js'
import {Question} from './Question';
import {isValid} from './utils';
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