import '../../styles/Navbar.css'
import { Link } from 'react-router-dom'

const Navbar = () => {
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
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign Up</Link>
            </div>
        </nav>
    )
}

export default Navbar
