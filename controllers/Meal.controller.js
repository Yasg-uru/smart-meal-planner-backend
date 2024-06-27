import Mealplan from "../models/MealPlane.models.js";
import catchaysynerror from "../middlewares/Catchasynerror.middleware.js";
import Errorhandler from "../utils/Errorhandler.utils";
import Recipe from "../models/Recipe.model.js";
import {generateShoppingList} from "../helpers/Meal.helper.js";

import paginate from "mongoose-paginate";
import { FindFilteredRecipes } from "../helpers/Meal.helper.js";
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
