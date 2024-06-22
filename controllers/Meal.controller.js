import Mealplan from "../models/MealPlane.models.js";
import catchaysynerror from "../middlewares/Catchasynerror.middleware.js";
import Errorhandler from "../utils/Errorhandler.utils";
import Recipe from "../models/Recipe.model.js";
import { ObjectId } from "mongodb";
export const CreateMealplan = catchaysynerror(async (req, res, next) => {
  try {
    const { startDate, endDate, meals } = req.body;
    const user = req.user._id;
    const recipeIds = meals.recipes;
    const ShoppingList = [];
    const FilterRecipes = await FindFilteredRecipes(
      meals,
      req.user.dietaryPreferences,
      req.user.allergies
    );
    if (!FilterRecipes) {
      return next(new Errorhandler(404, "recipe not found "));
    }
    ShoppingList = await generateShoppingList(FilterRecipes);

    const newMealplan = await Mealplan.create({
      user,
      startDate,
      endDate,
      meals: FilterRecipes.map((recipe) => {
        return recipe._id;
      }),
    });
    res.status(200).json({
      success: true,
      message: "successfully created your meal plan",
      newMealplan,
      ShoppingList,
    });
  } catch (error) {
    return next(new Errorhandler(500, "Internal server error"));
  }
});
async function FindFilteredRecipes(meals, dietaryPreferences, allergies) {
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

async function generateShoppingList(recipes) {
  const ShoppingList = [];
  for (const recipe of recipes) {
    for (const ingredients of recipe.ingredients) {
      const existingingredients = ShoppingList.find(
        (item) => item.name === ingredients.name
      );
      if (existingingredients) {
        existingingredients.quantity += ingredients.quantity;
      } else {
        ShoppingList.push({
          name: ingredients.name,
          quantity: ingredients.quantity,
          isChecked:false
        });
      }
    }
  }
  return ShoppingList;
}

