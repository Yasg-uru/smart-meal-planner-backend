import ShoppingList from "../models/ShoppingList.model.js";
import catchaysynerror from "../middlewares/Catchasynerror.middleware.js";
import Errorhandler from "../utils/Errorhandler.utils.js";
export const createShoppingList = catchaysynerror(async (req, res, next) => {
  try {
    const { items } = req.body;
    const user = req.user._id;
    const newShoppingList = await ShoppingList.create({
      user,
      items,
    });
    res.status(200).json({
      success: true,
      message: "created shopping list successfully",
      newShoppingList,
    });
  } catch (error) {
    return next(new Errorhandler(500, "Internal server Error"));
  }
});
