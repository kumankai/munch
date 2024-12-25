import { useEffect } from 'react';
import { useUser } from '../../context/UserContext'
import { recipeService } from '../../services/recipeService'
import { toast } from 'react-toastify';
import '../../styles/Profile.css'
import { useNavigate } from 'react-router-dom';
import { RecipeData } from '../../types';

const Profile = () => {
    const { user, savedRecipes, setSavedRecipes } = useUser()
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserRecipes = async () => {
            try {
                const response = await recipeService.getUserRecipes();
                const recipesWithIngredients = await Promise.all(
                    response.recipes.map(async (recipe: RecipeData) => {
                        const ingredientsResponse = await recipeService.getIngredientsByRecipeId(recipe.id);
                        return { ...recipe, ingredients: ingredientsResponse.ingredients };
                    })
                );
                setSavedRecipes(recipesWithIngredients);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            }
        };

        if (user) {
            fetchUserRecipes();
        }
    }, [user, setSavedRecipes]);

    const handleDelete = async (recipeId: number) => {
        try {
            await recipeService.deleteRecipe(recipeId);
            setSavedRecipes(savedRecipes.filter(recipe => recipe.id !== recipeId));
            toast.success('Recipe deleted successfully!');
        } catch {
            toast.error('Failed to delete recipe');
        }
    };

    const handleRecipeClick = (recipe: RecipeData) => {
        navigate(`/recipe/details/${recipe.id}`, { state: { recipe } });
    };

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            <h2>Username: {user?.username}</h2>

            <div className="saved-recipes">
                <h2>Saved Recipes</h2>
                <div className="recipes-grid">
                    {savedRecipes.map((recipe) => (
                        <div 
                            key={recipe.id} 
                            className="recipe-card"
                            onClick={() => handleRecipeClick(recipe)}
                            style={{ cursor: 'pointer' }}
                        >
                            <img src={recipe.image_url} alt={recipe.title} />
                            <h3>{recipe.title}</h3>
                            <p>By {recipe.author}</p>
                            <button 
                                className="delete-button"
                                onClick={(e) => {
                                    e.stopPropagation();  // Prevent navigation when deleting
                                    handleDelete(recipe.id);
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                    {savedRecipes.length === 0 && (
                        <p className="no-recipes">No saved recipes yet</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile