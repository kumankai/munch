import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userService } from '../services/userService';
import { recipeService } from '../services/recipeService';
import { User } from '../types/user';
import { RecipeData } from '../types/recipe';

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    savedRecipes: RecipeData[];
    setSavedRecipes: (recipes: RecipeData[]) => void;
    loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [savedRecipes, setSavedRecipes] = useState<RecipeData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                if (accessToken) {
                    // Fetch user data if token exists
                    const { user: userData } = await userService.getCurrentUser();
                    setUser(userData);

                    // Fetch saved recipes
                    const recipes = await recipeService.getUserRecipes();
                    if (recipes && Array.isArray(recipes)) {
                        setSavedRecipes(recipes);
                    }
                }
            } catch (error) {
                console.error('Error loading user data:', error);
                localStorage.removeItem('accessToken');
                setUser(null);
                setSavedRecipes([]);
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, []);

    return (
        <UserContext.Provider value={{ 
            user, 
            setUser, 
            savedRecipes, 
            setSavedRecipes, 
            loading 
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}; 