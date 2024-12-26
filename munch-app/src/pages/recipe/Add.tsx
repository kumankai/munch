import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { recipeService } from '../../services/recipeService';
import { IngredientDto } from '../../types';
import { toast } from 'react-toastify';
import '../../styles/Add.css';

const Add = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [title, setTitle] = useState('');
    const [instructions, setInstructions] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [ingredients, setIngredients] = useState<IngredientDto[]>([{ name: '', quantity: 0, unit: '' }]);

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

    const handleIngredientChange = (index: number, field: keyof IngredientDto, value: string) => {
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
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            // Upload image first
            const formData = new FormData();
            if (imageFile) {
                formData.append('image', imageFile);
            }
            const imageUrl = imageFile ? await recipeService.uploadImage(formData) : '';

            const recipeData = {
                main: {
                    title,
                    instructions,
                    author: user.username,
                    image_url: imageUrl,
                    youtube_url: youtubeUrl,
                    user_id: user.id
                },
                ingredients: ingredients.filter(ing => ing.name?.trim() !== '')
            };

            await recipeService.createRecipe(recipeData);
            toast.success('Recipe added successfully!');
            navigate('/profile');
        } catch {
            toast.error('Failed to add recipe');
        }
    };

    return (
        <div className="add-recipe-container">
            <h1>Add Recipe</h1>
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
                        required
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
                    {ingredients.map((ingredient, index) => (
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

                <button type="submit" className="submit-button">Add Recipe</button>
            </form>
        </div>
    );
};

export default Add;