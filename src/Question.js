export class Question {
    static create(question) {
        return fetch('https://registration-of-questions-app.firebaseio.com/question.json', {
            method: 'POST',
            body: JSON.stringify(question),
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(response => {
                question.id = response.name
                return question
            })
            .then(Question.#addToLocalStorage)
            .then(Question.renderList)
    }

    static renderList() {
        const questions = Question.#getQuestionsFromLocalStorage()
        const html = questions.length ? questions.map(Question.#toCard).join(' ')
            : `<div class="mui--text-headline">Вы пока ничего не спрашивали</div>`
        const list = document.querySelector('#list')
        list.innerHTML = html
    }

    static #toCard(question) {
        return `
        <div>
            ${new Date(question.date).toLocaleDateString('ru')}
            ${new Date(question.date).toLocaleTimeString('ru')}
        </div>
        <div>${question.text}</div>
        <br>
        `
    }

    static #addToLocalStorage(question) {
        const all = Question.#getQuestionsFromLocalStorage()
        all.push(question)
        localStorage.setItem('questions', JSON.stringify(all))
    }

    static #getQuestionsFromLocalStorage() {
        return JSON.parse(localStorage.getItem('questions') || '[]')
    }
}