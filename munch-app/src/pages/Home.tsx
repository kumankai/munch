import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    
    return (
        <div>
            <p>{import.meta.env.VITE_API_URL}</p>
            <h1>Welcome to Munch</h1>
            <button 
                    className="search-button"
                    onClick={() => navigate('/search')}
                >
                    Search Recipes
                </button>
        </div>
    )
}

export default Home