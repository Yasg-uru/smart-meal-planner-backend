import express from "express";
import ConnectDatabase from "./config/ConnectDatabase.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(cookieParser());

ConnectDatabase();

app.listen(4000, () => {
  console.log("server is running on port :4000");
});
