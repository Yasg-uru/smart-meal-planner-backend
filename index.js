import express from "express";
import ConnectDatabase from "./config/ConnectDatabase.js";
import cookieParser from "cookie-parser";
import UserRouter from "./routers/user.routers.js";
import RecipeRouter from "./routers/Recipe.routes.js";

import bodyParser from "body-parser";
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/user",UserRouter)
app.use("/recipe",RecipeRouter);

ConnectDatabase();

app.listen(4000, () => {
  console.log("server is running on port :4000");
});
