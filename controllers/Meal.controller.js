import Mealplan from "../models/MealPlane.models.js";
import catchaysynerror from "../middlewares/Catchasynerror.middleware.js";
import Errorhandler from "../utils/Errorhandler.utils.js";
import Recipe from "../models/Recipe.model.js";
import { generateShoppingList } from "../helpers/Meal.helper.js";
import User from "../models/user.models.js";

import paginate from "mongoose-paginate";
import { FindFilteredRecipes } from "../helpers/Meal.helper.js";
export const CreateMealplan = catchaysynerror(async (req, res, next) => {
  try {
    const { startDate, endDate, meals } = req.body;
    const user = req.user._id;

    const FilterRecipes = await FindFilteredRecipes(
      meals,
      req.user.dietaryPreferences,
      req.user.allergies
    );
    if (!FilterRecipes) {
      return next(new Errorhandler(404, "recipe not found "));
    }
    console.log("this is filterrecipes", FilterRecipes);
    const ShoppingList = await generateShoppingList(FilterRecipes);
    const filteredRecipeIds = FilterRecipes.map((recipe) => {
      return recipe._id.toString();
    });
    console.log("this is filtered recipes:", filteredRecipeIds);
    const FilteredData = meals.map((meal) => ({
      ...meal,
      recipes: meal.recipes.filter((recipeId) =>
        filteredRecipeIds.includes(recipeId)
      ),
    }));
    console.log("this is new meal", FilteredData);

    const newMealplan = await Mealplan.create({
      user,
      startDate,
      endDate,
      meals: FilteredData,
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

export const deleteMeal = catchaysynerror(async (req, res, next) => {
  try {
    const { mealId } = req.params;
    const deletedMeal = await Mealplan.findByIdAndDelete(mealId);
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
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    return next(new Errorhandler(404, "please enter both start and end Date "));
  }
  const start = new Date(startDate),
    end = new Date(endDate);

  const result = await Mealplan.find({
    startDate: { $gte: start },
    endDate: { $lte: endDate },
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

export const FiltermealplanByyourdietaryPreferences = catchaysynerror(
  async (req, res, next) => {
    try {
      // Find the user's dietary preferences
      const user = await User.findById(req.user._id);
      if (!user) {
        return next(new Error("User not found")); // Handle case where user is not found
      }
      const dietaryPreferences = user.dietaryPreferences;

      // Find all recipes to filter meal plans
      const allRecipes = await Recipe.find();
      if (!allRecipes) {
        return next(new Error("Recipes not found")); // Handle case where recipes are not found
      }

      // Find all meal plans
      const mealPlans = await Mealplan.find();
      if (!mealPlans) {
        return next(new Error("Meal plans not found")); // Handle case where meal plans are not found
      }

      // Filter recipes based on dietary preferences
      const filteredRecipes = allRecipes.filter((recipe) =>
        recipe.dietaryLabels.some((label) => dietaryPreferences.includes(label))
      );

      // Prepare meal plans that include filtered recipes
      const filteredMealPlans = mealPlans.map((mealPlan) => {
        const filteredMeals = mealPlan.meals.map((meal) => ({
          day: meal.day,
          recipes: meal.recipes.filter((recipeId) =>
            filteredRecipes.some((recipe) => recipe._id.equals(recipeId))
          ),
        }));
        return {
          _id: mealPlan._id,
          user: mealPlan.user,
          startDate: mealPlan.startDate,
          endDate: mealPlan.endDate,
          meals: filteredMeals,
        };
      });

      res.status(200).json({
        success: true,
        message: "Successfully fetched your filtered meal plans",
        filteredMealPlans,
      });
    } catch (error) {
      next(new Errorhandler(500, error)); // Pass any caught error to the error handler middleware
    }
  }
);
