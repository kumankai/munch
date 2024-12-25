import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipeService } from '../../services/recipeService';
import { RecipeAPIReponse } from '../../types';
import '../../styles/Search.css';

const Search = () => {
    const navigate = useNavigate();
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [currentIngredient, setCurrentIngredient] = useState('');
    const [recipes, setRecipes] = useState<RecipeAPIReponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAddIngredient = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentIngredient.trim() && ingredients.length < 10) {
            setIngredients([...ingredients, currentIngredient.trim()]);
            setCurrentIngredient('');
        }
    };

    const handleRemoveIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleSearch = async () => {
        if (ingredients.length === 0) {
            setError('Please add at least one ingredient');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const { recipes: searchResults } = await recipeService.getRecipesByIngredients(ingredients);
            if (searchResults && Array.isArray(searchResults)) {
                setRecipes(searchResults);
            } else {
                setRecipes([]);
                setError('No recipes found');
            }
        } catch (err) {
            setError('Failed to fetch recipes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-container">
            <h1>Search Recipes</h1>
            
            <div className="search-form">
                <form onSubmit={handleAddIngredient}>
                    <input
                        type="text"
                        value={currentIngredient}
                        onChange={(e) => setCurrentIngredient(e.target.value)}
                        placeholder="Enter an ingredient"
                        disabled={ingredients.length >= 10}
                    />
                    <button 
                        type="submit"
                        disabled={ingredients.length >= 10 || !currentIngredient.trim()}
                    >
                        Add Ingredient
                    </button>
                </form>

                <div className="ingredients-list">
                    {ingredients.map((ingredient, index) => (
                        <div key={index} className="ingredient-tag">
                            {ingredient}
                            <button onClick={() => handleRemoveIngredient(index)}>×</button>
                        </div>
                    ))}
                </div>

                {ingredients.length >= 10 && (
                    <p className="max-ingredients">Maximum 10 ingredients reached</p>
                )}

                <button 
                    onClick={handleSearch} 
                    className="search-button"
                    disabled={ingredients.length === 0 || loading}
                >
                    {loading ? 'Searching...' : 'Search Recipes'}
                </button>

                {error && <p className="error">{error}</p>}
            </div>

            <div className="recipes-grid">
                {recipes.map((recipe) => (
                    <div 
                        key={recipe.idMeal} 
                        className="recipe-card"
                        onClick={() => navigate(`/recipe/${recipe.idMeal}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <img src={recipe.strMealThumb} alt={recipe.strMeal} />
                        <h3>{recipe.strMeal}</h3>
                        <p>{recipe.strArea} • {recipe.strCategory}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Search;