import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const mode = import.meta.env.MODE;
    
    return (
        <div>
            <p>{mode}</p>
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