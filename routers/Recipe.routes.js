import { Router } from "express";
import {
  Comparerecipewithdailygoals,
  GetAdjustedRecipe,
  GetAllRecipes,
  GetRecipesAccordingtoMissingIngredients,
  GetRecipesBySearch,
  GetRecipesBypagination,
  LikeRecipebyuser,
  compareRecipeBynutrients,
  createRecipe,
  deleterecipe,
  updaterecipe,
} from "../controllers/Recipe.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const RecipeRouter = Router();
RecipeRouter.post("/create", isAuthenticated, createRecipe);
RecipeRouter.put("/update/:id", isAuthenticated, updaterecipe);
RecipeRouter.delete("/delete/:id", isAuthenticated, deleterecipe);
RecipeRouter.get("/bysearch", isAuthenticated, GetRecipesBySearch);
RecipeRouter.get("/bypagination", isAuthenticated, GetRecipesBypagination);
RecipeRouter.get("/compare", isAuthenticated, Comparerecipewithdailygoals);
RecipeRouter.get("/compareRecipes", isAuthenticated, compareRecipeBynutrients);
RecipeRouter.post(
  "/bymissing",
  isAuthenticated,
  GetRecipesAccordingtoMissingIngredients
);
RecipeRouter.get("/adjusted", isAuthenticated, GetAdjustedRecipe);
RecipeRouter.put("/like/:recipeId", isAuthenticated, LikeRecipebyuser);
RecipeRouter.get("/", isAuthenticated, GetAllRecipes);

export default RecipeRouter;
