import express from "express";
import ConnectDatabase from "./config/ConnectDatabase.js";
import cookieParser from "cookie-parser";
import UserRouter from "./routers/user.routers.js";
import RecipeRouter from "./routers/Recipe.routes.js";
import shoppingRouter from "./routers/shoppingList.routes.js";
import mealplanRouter from "./routers/mealplan.routes.js";
import { ErrorhandlerMiddleware } from "./utils/Errorhandler.utils.js";
import cors from "cors";

import bodyParser from "body-parser";
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    // credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/user", UserRouter);
app.use("/recipe", RecipeRouter);
app.use("/shopping", shoppingRouter);
app.use("/mealplan", mealplanRouter);

app.use(ErrorhandlerMiddleware);
ConnectDatabase();

app.listen(4000, () => {
  console.log("server is running on port :4000");
});
