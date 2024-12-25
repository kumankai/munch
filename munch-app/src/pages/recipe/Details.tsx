import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { recipeService } from '../../services/recipeService';
import { RecipeAPIReponse } from '../../types';
import '../../styles/Details.css';

const Details = () => {
    const { id } = useParams<{ id: string }>();
    const [recipe, setRecipe] = useState<RecipeAPIReponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                if (!id) return;
                setLoading(true);
                const data = await recipeService.getRecipeByRecipeId(parseInt(id));
                setRecipe(data);
            } catch (err) {
                setError('Failed to load recipe');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!recipe) return <div className="error">Recipe not found</div>;

    // Get all ingredients and measures
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}` as keyof RecipeAPIReponse];
        const measure = recipe[`strMeasure${i}` as keyof RecipeAPIReponse];
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

export default Details;
