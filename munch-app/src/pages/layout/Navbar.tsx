import { useState, useRef, useEffect } from 'react'
import '../../styles/Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import { authService } from '../../services/authService'
import logo from '../../assets/logo.svg';

const Navbar = () => {
    const navigate = useNavigate()
    const { user, setUser } = useUser()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleLogout = async () => {
        try {
            await authService.logout()
        } catch (error: unknown) {
            console.log('Logout error:', error)
        } finally {
            setUser(null)
            setIsDropdownOpen(false)
            navigate('/')
        }
    }

    return (
        <nav className="navbar">
            <div 
                className="brand" 
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
            >
                <img src={logo} alt="Munch Logo" className="brand-logo" />
                <span className="brand-name">Munch</span>
            </div>
            <div className="left-links">
                <Link to="/search">Search</Link>
                <Link to="/add-recipe">Add Recipe</Link>
            </div>
            <div className="nav-links">
                {user ? (
                    <div className="dropdown" ref={dropdownRef}>
                        <button 
                            className="dropdown-toggle"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            {user.username}
                        </button>
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <button onClick={() => {
                                    navigate('/profile')
                                    setIsDropdownOpen(false)
                                }}>
                                    Profile
                                </button>
                                <button onClick={() => {
                                    navigate('/settings')
                                    setIsDropdownOpen(false)
                                }}>
                                    Settings
                                </button>
                                <button onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar