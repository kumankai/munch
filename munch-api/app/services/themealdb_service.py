import aiohttp
from typing import List
import asyncio

BASEURL = "https://www.themealdb.com/api/json/v1/1/"

class TheMealDbService:
    @staticmethod
    async def search_by_ingredients(ingredients: List[str]) -> List[dict]:
        unique_meals = {}  # Use dict for O(1) lookup
        
        # Create tasks for all ingredient searches
        tasks = []
        for ingredient in ingredients:
            tasks.append(TheMealDbService.search_by_ingredient(ingredient))
            
        # Run all requests concurrently
        results = await asyncio.gather(*tasks)
        
        # Flatten results and remove duplicates
        for recipes in results:
            for recipe in recipes:
                meal_id = recipe['idMeal']
                if meal_id not in unique_meals:
                    unique_meals[meal_id] = recipe

        return list(unique_meals.values())

    @staticmethod
    async def search_by_ingredient(ingredient: str) -> List[dict]:
        async with aiohttp.ClientSession() as session:
            url = f"{BASEURL}filter.php?i={ingredient}"
            
            async with session.get(url) as response:
                data = await response.json()
                if not data.get('meals'):
                    return []

                # Create tasks for all recipe details
                tasks = []
                for meal in data['meals']:
                    tasks.append(TheMealDbService.get_recipe(meal['strMeal']))
                
                # Run all requests concurrently
                return await asyncio.gather(*tasks)

    @staticmethod
    async def get_recipe(recipe_title: str) -> dict:
        async with aiohttp.ClientSession() as session:
            url = f"{BASEURL}search.php?s={recipe_title}"
            
            async with session.get(url) as response:
                data = await response.json()
                return data['meals'][0] if data.get('meals') else None