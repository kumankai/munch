import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { useUser } from '../context/UserContext'
import { ApiError } from '../types/api'

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
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
        try {
            const response = await authService.login({
                username: formData.username,
                password: formData.password
            })
            
            setUser(response.user)
            
            navigate('/')
        } catch (err: unknown) {
            const error = err as ApiError
            setError(error.response?.data?.error || 'An error occurred during login')
        }
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Login</h1>
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
                            placeholder="Username"
                            autoComplete="username"
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
                            placeholder="Password"
                            autoComplete="current-password"
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login