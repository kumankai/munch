import { useUser } from '../../context/UserContext'
import '../../styles/Profile.css'

const Profile = () => {
    const { user, savedRecipes } = useUser()

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            <h2>Username: {user?.username}</h2>

            <div className="saved-recipes">
                <h2>Saved Recipes</h2>
                <div className="recipes-grid">
                    {savedRecipes.map((recipe, index) => (
                        <div key={index} className="recipe-card">
                            <img src={recipe.image_url} alt={recipe.title} />
                            <h3>{recipe.title}</h3>
                            <p>By {recipe.author}</p>
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