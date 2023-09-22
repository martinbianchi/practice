import * as styles from './questionnaireStyles.module.css'
import { useReducer, useState } from "react"
import { reducer, mapQuestionnaireToState, ACTIONS } from './reducer'

export const QUESTIONNAIRE = [
    {
        id: 1,
        type: 'checkbox',
        question: 'What is your favorite color?',
        options: {
            1: 'Red',
            2: 'Blue',
            3: 'Green',
            4: 'Yellow'
        },
        answer: [1, 2, 4]
    },
    {
        id: 2,
        type: 'checkbox',
        question: 'What is your favorite food?',
        options: {
            1: 'Pizza',
            2: 'Burger',
            3: 'Pasta',
            4: 'Salad'
        },
        answer: [1, 3]
    },
    {
        id: 3,
        type: 'radio',
        question: 'Do you like coding?',
        options: {
            1: 'Yes',
            2: 'No'
        },
        answer: [1]
    },
    {
        id: 4,
        type: 'checkbox',
        question: 'Which programming languages do you know?',
        options: {
            1: 'JavaScript',
            2: 'Python',
            3: 'Java',
            4: 'C#'
        },
        answer: [1, 2]
    },
    {
        id: 5,
        type: 'radio',
        question: 'Are you a front-end developer?',
        options: {
            1: 'Yes',
            2: 'No'
        },
        answer: [2]
    }
]

const Question = ({ item, value, setValue }) => {
    return <div>
        <p className={styles.question}>{item.question}</p>
        <div className={styles.optionsContainer}>
            {Object.entries(item.options).map(([id, option]) => (
                <div className={styles.input} key={id}>
                    <input id={`${item.id}_${id}`} name={item.id} type={item.type} value={id} checked={value.includes(id)}
                        onChange={e => setValue(e.target.value)} />
                    <label htmlFor={`${item.id}_${id}`}>{option}</label>
                </div>
            ))}
        </div>
    </div>
}


export const Questionnaire = () => {
    const [state, dispatch] = useReducer(reducer, mapQuestionnaireToState(QUESTIONNAIRE))
    const [score, setScore] = useState(null)


    const calculateScore = (e) => {
        e.preventDefault()
        const finalScore = Object.values(state).reduce((acum, item) => {
            if (item.answer.length !== item.value.length) {
                return acum
            }

            const allValidAnswers = item.answer.every(validAnswer => item.value.toString().includes(validAnswer.toString()))
            if (allValidAnswers) {
                return acum + 1
            }

            return acum
        }, 0)

        setScore(finalScore)
    }

    const resetQuestionnaire = () => {
        dispatch({ type: ACTIONS.SET_QUESTIONNAIRE, payload: QUESTIONNAIRE })
        setScore(null)
    }

    return (
        <form onSubmit={calculateScore} className={styles.main}>
            <h2>Questionnaire:</h2>
            <div className={styles.questionnaire}>
                {QUESTIONNAIRE.map(question => (
                    <Question key={question.id} item={question} value={state[question.id].value}
                        setValue={(answer) => dispatch({
                            type: question.type === 'checkbox'
                                ? ACTIONS.SET_CHECKBOX_VALUE
                                : ACTIONS.SET_RADIO_VALUE,
                            payload: {
                                questionId: question.id,
                                answerId: answer
                            }
                        })} />
                ))}
                <div className={styles.actions}>
                    <button className={styles.button}>Submit</button>
                    <button type="button" onClick={resetQuestionnaire} disabled={score === null} className={styles.button}>RESET</button>
                </div>
            </div>
            {score !== null && <div>
                <p>YOUR SCORE: {score}</p>
            </div>}
        </form>
    )
}