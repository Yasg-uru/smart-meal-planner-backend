import catchaysynerror from "../middlewares/Catchasynerror.middleware.js";
import Errorhandler from "../utils/Errorhandler.utils.js";
import UploadOnCloudinary from "../utils/cloudinary.utils.js";
import Recipe from "../models/Recipe.model.js";

export const createRecipe = catchaysynerror(async (req, res, next) => {
//   try {
    let imageurl = null;
    if (req.file && req.file.path) {
      const cloudinary = await UploadOnCloudinary(req.file.path);
      imageurl = cloudinary.secure_url;
    }
    const author = req.user?._id;

    const newRecipe = await Recipe.create({ author, imageurl, ...req.body });
    res.status(200).json({
      success: true,
      message: "successfully created recipe",
      newRecipe,
    });
//   } catch (error) {
//     return next(new Errorhandler(500, "Internal server error"));
//   }
});
