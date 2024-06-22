import Mealplan from "../models/MealPlane.models.js";
import catchaysynerror from "../middlewares/Catchasynerror.middleware.js";
import Errorhandler from "../utils/Errorhandler.utils";
import Recipe from "../models/Recipe.model.js";
import { ObjectId } from "mongodb";
import paginate from "mongoose-paginate";

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
          isChecked: false,
        });
      }
    }
  }
  return ShoppingList;
}

export const deleteMeal = catchaysynerror(async (req, res, next) => {
  try {
    const { mealId } = req.params;
    const deletedMeal = await Mealplan.findbyIdAndDelete(mealId);
    if (!deleteMeal) {
      return next(new Errorhandler(404, "meal deletion failed "));
    }
    res.status(200).json({
      success: true,
      message: "deleted your meal plan successfully",
      deletedMeal,
    });
  } catch (error) {
    return next(new Errorhandler(500, "Internal server error "));
  }
});

export const getyourmeals = catchaysynerror(async (req, res, next) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: 10,
    };
    const mealplanes = await Mealplan.paginate({ user: req.user._id }, options);
    if (!mealplanes) {
      return next(new Errorhandler(404, "meal plan not found "));
    }
    res.status(200).json({
      success: true,
      message: "successfully fecthed your meal ",
      mealplanes,
    });
  } catch (error) {
    return next(new Errorhandler(500, "Internal server error "));
  }
});
export const searchyourmeals = catchaysynerror(async (req, res, next) => {
  try {
    const { searchTerm } = req.query;
    const result = await Mealplan.find({
      $text: { $search: searchTerm },
    });
    if (!result) {
      return next(
        new Errorhandler(404, "meal plan not found for this searchquery")
      );
    }
    res.status(200).json({
      success: true,
      message: "successfully searched your meal plan ",
      result,
    });
  } catch (error) {
    return next(new Errorhandler(500, "Internal server error "));
  }
});
