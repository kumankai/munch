import { useEffect } from 'react';
import { useUser } from '../../context/UserContext'
import { recipeService } from '../../services/recipeService'
import { toast } from 'react-toastify';
import '../../styles/Profile.css'

const Profile = () => {
    const { user, savedRecipes, setSavedRecipes } = useUser()

    useEffect(() => {
        const fetchSavedRecipes = async () => {
            try {
                const response = await recipeService.getUserRecipes();
                console.log(response);
                const recipes = response?.recipes || [];
                setSavedRecipes(Array.isArray(recipes) ? recipes : []);
            } catch (error) {
                console.error('Error fetching saved recipes:', error)
            }
        }

        if (user) {
            fetchSavedRecipes()
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

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            <h2>Username: {user?.username}</h2>

            <div className="saved-recipes">
                <h2>Saved Recipes</h2>
                <div className="recipes-grid">
                    {savedRecipes.map((recipe) => (
                        <div key={recipe.id} className="recipe-card">
                            <img src={recipe.image_url} alt={recipe.title} />
                            <h3>{recipe.title}</h3>
                            <p>By {recipe.author}</p>
                            <button 
                                className="delete-button"
                                onClick={() => handleDelete(recipe.id)}
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