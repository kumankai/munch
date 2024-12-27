import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipeService } from '../../services/recipeService';
import { RecipeAPIResponse, RecipesAPIResponse } from '../../types';
import '../../styles/Search.css';

const Search = () => {
    const navigate = useNavigate();
    const [ingredients, setIngredients] = useState<string[]>(() => {
        const saved = localStorage.getItem('searchIngredients');
        return saved ? JSON.parse(saved) : [];
    });
    const [currentIngredient, setCurrentIngredient] = useState('');
    const [recipes, setRecipes] = useState<RecipeAPIResponse[]>(() => {
        try {
            const saved = localStorage.getItem('searchResults');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error parsing saved search results:', error);
            return [];
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Save to localStorage whenever ingredients or recipes change
    useEffect(() => {
        try {
            localStorage.setItem('searchIngredients', JSON.stringify(ingredients));
            localStorage.setItem('searchResults', JSON.stringify(recipes));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }, [ingredients, recipes]);

    const handleAddIngredient = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentIngredient.trim()) {
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
            const response: RecipesAPIResponse = await recipeService.getRecipesByIngredients(ingredients);
            setRecipes(response.recipes);
            // Immediately save to localStorage after setting new recipes
            localStorage.setItem('searchResults', JSON.stringify(response.recipes));
        } catch (err) {
            setError('Failed to fetch recipes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRecipeClick = (recipe: RecipeAPIResponse) => {
        navigate(`/recipe/search/${recipe.idMeal}`, { state: { recipe } });
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

            {recipes.length > 0 && (
                <h2 className="results-count">
                    {recipes.length} {recipes.length === 1 ? 'Recipe' : 'Recipes'} Found
                </h2>
            )}

            <div className="recipes-grid">
                {recipes.map((recipe: RecipeAPIResponse) => (
                    <div 
                        key={recipe.idMeal} 
                        className="recipe-card"
                        onClick={() => handleRecipeClick(recipe)}
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