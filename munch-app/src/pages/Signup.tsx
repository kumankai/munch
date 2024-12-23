import '../styles/Signup.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../api/services/authService'
import { useUser } from '../context/UserContext'
import { ApiError } from '../types/api'

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    })
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { setUser } = useUser()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError('')
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match!")
            return
        }

        try {
            const response = await authService.signup({
                username: formData.username,
                password: formData.password
            })
            
            if (response.access_token) {
                localStorage.setItem('accessToken', response.access_token)
                setUser(response.user)
                
                navigate('/')
            } else {
                navigate('/login')
            }
        } catch (err: unknown) {
            const error = err as ApiError
            setError(error.response?.data?.error || 'An error occurred during signup')
        }
    }

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h1>Create Account</h1>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit">Sign Up</button>
                </form>
            </div>
        </div>
    )
}

export default Signup