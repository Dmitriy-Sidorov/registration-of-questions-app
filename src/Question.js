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

    static fetch(token) {
        if(!token) {
            return Promise.resolve(`<p class="error">У вас нет токена</p>`)
        }

        return fetch(`https://registration-of-questions-app.firebaseio.com/question.json?auth=${token}`)
            .then(response => response.json())
            .then(response => {
                if (response && response.error) {
                    return `<p class="error">${response.error}</p>`
                }

                return response ? Object.keys(response).map(key => ({
                    ...response[key],
                    id: key
                })) : []
            })
    }

    static renderList() {
        const questions = Question.#getQuestionsFromLocalStorage()
        const html = questions.length ? questions.map(Question.#toCard).join(' ')
            : `<div class="mui--text-headline">Вы пока ничего не спрашивали</div>`
        const list = document.querySelector('#list')
        list.innerHTML = html
    }

    static listToHTML(questions) {
        return questions.length
            ? `<ol>${questions.map(q => `<li>${q.text}</li>`).join('')}</ol>`
            : '<p>Вопросов пока нет</p>'
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