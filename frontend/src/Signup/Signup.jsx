import * as signupStyles from './signupStyles.module.css'
import { useState } from "react"


const MIN_PASSWORD_LENGTH = 8

const validateEmail = (email) => {
    const [userEmail, userDomain] = email.split('@')
    const [provider, domain] = userDomain.split('.')

    return userEmail && provider && domain
}

const validatePassword = (password = '') => {
    if (password.length < MIN_PASSWORD_LENGTH) {
        return {
            valid: false,
            error: 'Password too short'
        }
    }

    if (!password.match(/[0-9]/)) {
        return {
            valid: false,
            error: 'Password must include a number'
        }
    }

    if (!password.match(/[\W]/)) {
        return {
            valid: false,
            error: 'Password must include a special character'
        }
    }


    return {
        valid: true,
        error: ''
    }

}

const loginUser = (email, password) => {
    return true
}

export const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(e)
        setError('')

        if (!validateEmail(email)) {
            setError('Invalid email')
            return
        }

        const { valid: validPassword, error: errorPassword } = validatePassword(password)

        if (!validPassword) {
            setError(errorPassword)
            return
        }

        try {
            setLoading(true)
            setTimeout(() => loginUser(email, password), 500)
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    const setFormInputValue = (setFn) => (e) => setFn(e.target.value)

    return (
        <div className={signupStyles.main}>
            <form className={signupStyles.form} onSubmit={handleSubmit}>
                <div className={signupStyles.formInput}>
                    <label htmlFor="email">Email</label>
                    <input className={signupStyles.input} id="email" name="email" type="email" value={email} onChange={setFormInputValue(setEmail)} required />
                </div>
                <div className={signupStyles.formInput}>
                    <label htmlFor="password">Password</label>
                    <input className={signupStyles.input} id="password" name="password" type="password" value={password} onChange={setFormInputValue(setPassword)} required />
                </div>
                {error && <p className={signupStyles.error}>{error}</p>}
                <button className={signupStyles.submitButton} disabled={loading}>Login</button>
            </form>
        </div>)
}