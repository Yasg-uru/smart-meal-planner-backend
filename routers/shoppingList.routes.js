import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { UpdatedShoppingListStatus, createShoppingList, deletshoppingList, getShoppinglistbypagination, getshoppinglistbysearchbar } from "../controllers/Shopping.controller.js";

const shoppingRouter=Router();
shoppingRouter.post("/create",isAuthenticated,createShoppingList);
shoppingRouter.put("/update",isAuthenticated,UpdatedShoppingListStatus);
shoppingRouter.delete("/delete",isAuthenticated,deletshoppingList);
shoppingRouter.get("/bysearchbar",isAuthenticated,getshoppinglistbysearchbar);
shoppingRouter.get("/bypagination",isAuthenticated,getShoppinglistbypagination);


export default shoppingRouter;
