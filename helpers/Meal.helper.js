import { ObjectId } from "mongodb";
import Recipe from "../models/Recipe.model.js";
export async function FindFilteredRecipes(meals, dietaryPreferences, allergies) {
    const recipeIds = meals.every((meal) => {
      meal.recipes.map((id) => {
        ObjectId(id);
      });
    });
    let query = { _id: { $in: recipeIds } };
    if (dietaryPreferences.length > 0) {
      query["dietaryLabels"] = { $in: dietaryPreferences };
    }
    if (allergies.length > 0) {
      query["ingredients.name"] = { $nin: allergies };
    }
    return await Recipe.find(query);
  }