import { Router } from "express";
const mealplanRouter = Router();
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { CreateMealplan } from "../controllers/Meal.controller";

mealplanRouter.post("/create", isAuthenticated, CreateMealplan);

export default mealplanRouter;
