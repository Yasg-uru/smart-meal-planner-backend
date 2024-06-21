import {Router} from "express";
import { createRecipe } from "../controllers/Recipe.controller.js";
import {isAuthenticated} from "../middlewares/auth.middleware.js";

const RecipeRouter=Router();
RecipeRouter.post("/create",isAuthenticated,createRecipe);
export default RecipeRouter;
