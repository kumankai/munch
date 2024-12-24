import { useState } from 'react';
import { recipeService } from '../../services/recipeService';
import { Recipe } from '../../types';
import '../../styles/Search.css';

const Search = () => {
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [currentIngredient, setCurrentIngredient] = useState('');
    const [recipes, setRecipes] = useState<Recipe[]>([]);
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
            const result = await recipeService.getRecipesByIngredients(ingredients);
            setRecipes(result as Recipe[]);
        } catch (err) {
            setError('Failed to fetch recipes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-container">
            <h1>Search Recipes by Ingredients</h1>
            
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
                    <div key={recipe.id} className="recipe-card">
                        <img src={recipe.image_url} alt={recipe.title} />
                        <h3>{recipe.title}</h3>
                        <p>By {recipe.author}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Search;