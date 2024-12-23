import '../../styles/Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import { authService } from '../../api/services/authService'

const Navbar = () => {
    const navigate = useNavigate()
    const { user, setUser } = useUser()

    const handleLogout = async () => {
        try {
            await authService.logout()
            setUser(null)
            navigate('/login')
        } catch (error) {
            console.error('Logout failed:', error)
            // Still navigate to login even if the request fails
            setUser(null)
            navigate('/login')
        }
    }

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/">Munch</Link>
            </div>
            <div className="left-links">
                <Link to="/search">Search</Link>
                <Link to="/add-recipe">Add Recipe</Link>
            </div>
            <div className="nav-links">
                {user ? (
                    <button onClick={handleLogout}>Logout</button>
                ) : (
                    <button onClick={() => navigate('/login')}>Login</button>
                )}
                <Link to="/signup">Sign Up</Link>
            </div>
        </nav>
    )
}

export default Navbar
