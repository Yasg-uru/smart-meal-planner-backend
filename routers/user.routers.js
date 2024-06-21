import {Router} from "express";
import { Login, RegisterUser } from "../controllers/user.controller.js";
const UserRouter=Router();
UserRouter.post("/register",RegisterUser);
UserRouter.post("/login",Login);
export default UserRouter;

