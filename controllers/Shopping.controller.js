import ShoppingList from "../models/ShoppingList.model.js";
import catchaysynerror from "../middlewares/Catchasynerror.middleware.js";
import Errorhandler from "../utils/Errorhandler.utils.js";
export const createShoppingList = catchaysynerror(async (req, res, next) => {
  try {
    const { items } = req.body;
    const user = req.user._id;
    console.log("this is items in shopping controller :", items);
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

export const UpdatedShoppingListStatus = catchaysynerror(
  async (req, res, next) => {
    // try {
    const { shoppingId } = req.query;
    console.log("this is a shopping id :", shoppingId);
    const UpdatedshoppingList = await ShoppingList.findByIdAndUpdate(
      shoppingId,
      req.body,
      {
        new: true,
      }
    );
    console.log("this is a updated list ", UpdatedshoppingList);
    if (!UpdatedshoppingList) {
      return next(new Errorhandler(404, "list not found"));
    }
    res.status(200).json({
      success: true,
      message: "successfully updated your shopping list ",
      UpdatedshoppingList,
    });
    // } catch (error) {
    //   return next(new Errorhandler(500, "Internal server error "));
    // }
  }
);
export const deletshoppingList = catchaysynerror(async (req, res, next) => {
  try {
    const { id } = req.query;
    console.log("this is a delete functon ");
    const deletedlist = await ShoppingList.findByIdAndDelete(id);
    if (!deletedlist) {
      return next(new Errorhandler(404, "list not found with this id "));
    }
    res.status(200).json({
      success: true,
      message: "deleted your list successfully",
      deletedlist,
    });
  } catch (error) {
    return next(new Errorhandler(500, "Internal server error"));
  }
});
export const getshoppinglistbysearchbar = catchaysynerror(
  async (req, res, next) => {
    try {
    const { searchterm } = req.query;
    if (!searchterm) {
      return next(new Errorhandler(404, "please enter the searchquery"));
    }
    const searchresult = await ShoppingList.find({
      $text: { $search: searchterm },
    });
    if (!searchterm) {
      return next(new Errorhandler(404, "not result found with this query"));
    }
    res.status(200).json({
      success: true,
      message: "successfully fecthed your searched result ",
      searchresult,
    });
    } catch (error) {
      return next(new Errorhandler(500, "internal server error "));
    }
  }
);
export const getShoppinglistbypagination = catchaysynerror(
  async (req, res, next) => {
    try {
      const { currentpage } = req.query;
      const limit = 5;
      const skip = (currentpage - 1) * limit;
      const result = await ShoppingList.find().skip(skip).limit(limit);
      if (!result) {
        return next(new Errorhandler(404, "result not found for this page "));
      }
      const totaldocuments = await ShoppingList.countDocuments();
      const Totalpages = Math.ceil(totaldocuments / limit);
      const hasNextPage = currentpage < Totalpages;
      const hasPreviousPage = currentpage > 1;
      // console.log("this is a pagination ")
      res.status(200).json({
        success: true,
        message: "successfully fetched shoppinglist",
        result,
        Totalpages,
        hasNextPage,
        hasPreviousPage,
      });
    } catch (error) {
      return next(new Errorhandler(500, "Internal server error "));
    }
  }
);
