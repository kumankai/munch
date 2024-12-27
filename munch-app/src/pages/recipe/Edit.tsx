import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { recipeService } from '../../services/recipeService';
import { IngredientDto } from '../../types';
import { toast } from 'react-toastify';
import '../../styles/Add.css';

const Edit = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useUser();
    const recipe = state?.recipe;

    const [title, setTitle] = useState(recipe?.title || '');
    const [instructions, setInstructions] = useState(recipe?.instructions || '');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [youtubeUrl, setYoutubeUrl] = useState(recipe?.youtube_url || '');
    const [ingredients, setIngredients] = useState(recipe?.ingredients || [{ name: '', quantity: 0, unit: '' }]);

    useEffect(() => {
        if (!recipe) {
            navigate('/profile');
        }
    }, [recipe, navigate]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image must be less than 5MB');
                return;
            }
            if (!['image/jpeg', 'image/png'].includes(file.type)) {
                toast.error('Only JPG and PNG files are allowed');
                return;
            }
            setImageFile(file);
        }
    };

    const handleIngredientChange = (index: number, field: string, value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = { ...newIngredients[index], [field]: value };
        setIngredients(newIngredients);
    };

    const addIngredient = () => {
        if (ingredients.length < 20) {
            setIngredients([...ingredients, { name: '', quantity: 0, unit: '' }]);
        }
    };

    const removeIngredient = (index: number) => {
        setIngredients(ingredients.filter((_: IngredientDto, i: number) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !recipe) return;

        try {
            let imageUrl = recipe.image_url;
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                imageUrl = await recipeService.uploadImage(formData);
            }

            const recipeData = {
                main: {
                    title,
                    instructions,
                    author: user.username,
                    image_url: imageUrl,
                    youtube_url: youtubeUrl
                },
                ingredients: ingredients.filter((ing: IngredientDto) => ing.name?.trim() !== '')
            };

            await recipeService.updateRecipe(recipe.id, recipeData);
            toast.success('Recipe updated successfully!');
            navigate(`/recipe/details/${recipe.id}`);
        } catch {
            toast.error('Failed to update recipe');
        }
    };

    return (
        <div className="add-recipe-container">
            <h1>Edit Recipe</h1>
            <form onSubmit={handleSubmit} className="add-recipe-form">
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Instructions</label>
                    <textarea
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        required
                        rows={5}
                    />
                </div>

                <div className="form-group">
                    <label>Image (JPG/PNG, max 5MB)</label>
                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleImageChange}
                    />
                </div>

                <div className="form-group">
                    <label>YouTube URL (optional)</label>
                    <input
                        type="url"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                    />
                </div>

                <div className="ingredients-section">
                    <h2>Ingredients</h2>
                    {ingredients.map((ingredient: IngredientDto, index: number) => (
                        <div key={index} className="ingredient-row">
                            <input
                                type="text"
                                placeholder="Name"
                                value={ingredient.name}
                                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Quantity"
                                value={ingredient.quantity}
                                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Unit"
                                value={ingredient.unit}
                                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                required
                            />
                            {ingredients.length > 1 && (
                                <button 
                                    type="button" 
                                    onClick={() => removeIngredient(index)}
                                    className="remove-ingredient"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    {ingredients.length < 20 && (
                        <button 
                            type="button" 
                            onClick={addIngredient}
                            className="add-ingredient"
                        >
                            Add Ingredient
                        </button>
                    )}
                </div>

                <button type="submit" className="submit-button">Update Recipe</button>
            </form>
        </div>
    );
};

export default Edit; 