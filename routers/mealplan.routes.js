import { Router } from "express";
const mealplanRouter = Router();
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  CreateMealplan,
  FiltermealplanByyourdietaryPreferences,
  deleteMeal,
  getyourmeals,
  searchyourmeals,
} from "../controllers/Meal.controller.js";

mealplanRouter.post("/create", isAuthenticated, CreateMealplan);
mealplanRouter.delete("/delete/:mealId", isAuthenticated, deleteMeal);
mealplanRouter.get("/meals", isAuthenticated, getyourmeals);
mealplanRouter.get("/searchmeals", isAuthenticated, searchyourmeals);
mealplanRouter.get(
  "/bydietrypreference",
  isAuthenticated,
  FiltermealplanByyourdietaryPreferences
);
export default mealplanRouter;
