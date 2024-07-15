import {Router} from "express";
import { forgotPassword, Login, RegisterUser, ResetPassword } from "../controllers/user.controller.js";
const UserRouter=Router();
UserRouter.post("/register",RegisterUser);
UserRouter.post("/login",Login);
UserRouter.post("/forgot-password",forgotPassword);
UserRouter.put("/reset-password/:token",ResetPassword);

export default UserRouter;

