import express from "express";
import ConnectDatabase from "./config/ConnectDatabase.js";
const app = express();
ConnectDatabase();
app.listen(4000, () => {
  console.log("server is running on port :4000");
});
