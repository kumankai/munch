import { useLocation } from 'react-router-dom';
import { RecipeAPIResponse } from '../../types';
import '../../styles/Details.css';

const SearchDetails = () => {
    const { state } = useLocation();
    const recipe: RecipeAPIResponse = state?.recipe;

    if (!recipe) return <div className="error">Recipe not found</div>;

    // Convert YouTube URL to embed URL
    const getYoutubeEmbedUrl = (url: string) => {
        const videoId = url.split('v=')[1];
        return `https://www.youtube.com/embed/${videoId}`;
    };

    // Get all ingredients and measures
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}` as keyof RecipeAPIResponse];
        const measure = recipe[`strMeasure${i}` as keyof RecipeAPIResponse];
        if (ingredient && ingredient.trim()) {
            ingredients.push(`${measure} ${ingredient}`);
        }
    }

    return (
        <div className="recipe-details">
            <div className="recipe-header">
                <img src={recipe.strMealThumb} alt={recipe.strMeal} />
                <div className="recipe-info">
                    <h1>{recipe.strMeal}</h1>
                    <p className="category">{recipe.strCategory} • {recipe.strArea}</p>
                    {recipe.strYoutube && (
                        <div className="video-container">
                            <iframe
                                width="100%"
                                height="315"
                                src={getYoutubeEmbedUrl(recipe.strYoutube)}
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
                        {ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                </div>

                <div className="instructions">
                    <h2>Instructions</h2>
                    {recipe.strInstructions.split('\r\n').map((step, index) => (
                        step.trim() && <p key={index}>{step}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchDetails;
