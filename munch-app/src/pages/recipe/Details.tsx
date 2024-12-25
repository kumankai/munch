import { useLocation } from 'react-router-dom';
import { RecipeData, IngredientData } from '../../types';
import '../../styles/Details.css';

interface RecipeWithIngredients extends RecipeData {
    ingredients?: IngredientData[];
}

const Details = () => {
    const { state } = useLocation();
    const recipe: RecipeWithIngredients = state?.recipe;

    const handlePrint = () => {
        window.print();
    };

    if (!recipe) return <div className="error">Recipe not found</div>;

    const getYoutubeEmbedUrl = (url: string) => {
        const videoId = url.split('v=')[1];
        return `https://www.youtube.com/embed/${videoId}`;
    };
    
    return (
        <div className="recipe-details">
            <div className="recipe-header">
                <img src={recipe.image_url} alt={recipe.title} />
                <div className="recipe-info">
                    <h1>{recipe.title}</h1>
                    <p className="category">By {recipe.author}</p>
                    {recipe.youtube_url && (
                        <div className="video-container">
                            <iframe
                                src={getYoutubeEmbedUrl(recipe.youtube_url)}
                                title="Recipe Video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}
                </div>
            </div>

            <div className="recipe-content">
                <div className="ingredients">
                    <h2>Ingredients</h2>
                    <ul>
                        {recipe.ingredients?.map((ingredient, index) => (
                            <li key={index}>
                                {ingredient.quantity} {ingredient.unit} {ingredient.name}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="instructions">
                    <h2>Instructions</h2>
                    {recipe.instructions.split('\n').map((step, index) => (
                        step.trim() && <p key={index}>{step}</p>
                    ))}
                </div>
            </div>

            <div className="recipe-actions">
                <button 
                    className="action-button print-button"
                    onClick={handlePrint}
                >
                    Print Recipe
                </button>
            </div>
        </div>
    );
};

export default Details;
