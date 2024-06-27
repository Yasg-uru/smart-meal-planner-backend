import catchaysynerror from "../middlewares/Catchasynerror.middleware.js";
import Errorhandler from "../utils/Errorhandler.utils.js";
import UploadOnCloudinary from "../utils/cloudinary.utils.js";
import Recipe from "../models/Recipe.model.js";
import paginate from "mongoose-paginate-v2";
import { AdjustedIngredientQuantity } from "../helpers/Recipe.helper.js";
import User from "../models/user.models.js";
export const createRecipe = catchaysynerror(async (req, res, next) => {
  try {
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
  } catch (error) {
    return next(new Errorhandler(500, "Internal server error"));
  }
});

export const updaterecipe = catchaysynerror(async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedrecipe = await Recipe.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "updated your recipe successfully",
      updatedrecipe,
    });
  } catch (error) {
    return next(new Errorhandler(500, "Internal server error"));
  }
});
export const deleterecipe = catchaysynerror(async (req, res, next) => {
  try {
    const deletedrecipe = await Recipe.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "deleted your recipe successfully",
      deletedrecipe,
    });
  } catch (error) {
    return next(new Errorhandler(500, "Internal server error"));
  }
});

export const GetRecipesBySearch = catchaysynerror(async (req, res, next) => {
  try {
    const searchTerm = req.query.searchTerm || ""; // Assuming searchTerm comes from request query

    const query = { $text: { $search: searchTerm } }; // Make search term lowercase

    const recipes = await Recipe.find(query);
    if(recipes.length==0){
      return next(new Errorhandler(404,"recipes not found "));
    }
    res.status(200).json({
      success: true,
      message: "fetched your searched result successfully",
      recipes,
    });
  } catch (error) {
    return next(new Errorhandler(500, "Internal server error"));
  }
});
export const GetRecipesBypagination = catchaysynerror(
  async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 20;
      const options = { page, limit };
      const recipes = await Recipe.paginate({}, options);
      res.status(200).json({
        success: true,
        message: "fecthed your recipes successfully",
        recipes,
      });
    } catch (error) {
      return next(new Errorhandler(500, "Internal server error"));
    }
  }
);

export const Comparerecipewithdailygoals = catchaysynerror(
  async (req, res, next) => {
    try {
      const { recipeId } = req.query;
      if (!recipeId) {
        return next(new Errorhandler(404, "please provide recipeId"));
      }
      const recipe = await Recipe.findById(recipeId);
      if (!recipe) {
        return next(new Errorhandler(404, "Recipe not found"));
      }
      const dailyGoals = await req.user.nutritionalGoals;
      if (!dailyGoals) {
        return next(
          new Errorhandler(404, "User's daily nutritional goals not found")
        );
      }
      const comparedInfo = {
        calories: calculateDifference(
          recipe.nutritionalInfo.calories,
          dailyGoals.calories
        ),
        protein: calculateDifference(
          recipe.nutritionalInfo.protein,
          dailyGoals.protein
        ),
        carbohydrates: calculateDifference(
          recipe.nutritionalInfo.carbohydrates,
          dailyGoals.carbohydrates
        ),
        fats: calculateDifference(recipe.nutritionalInfo.fats, dailyGoals.fats),
        vitamins: compareNutrients(
          recipe.nutritionalInfo.vitamins,
          dailyGoals.vitamins
        ),
        minerals: compareNutrients(
          recipe.nutritionalInfo.minerals,
          dailyGoals.minerals
        ),
      };
      function calculateDifference(recipevalues, dailygoalvalues) {
        return (recipevalues / dailygoalvalues) * 100;
      }
      function compareNutrients(recipeNutrients, dailyGoalNuitrients) {
        return recipeNutrients.map((nuitrients) =>
          dailyGoalNuitrients.includes(nuitrients)
        );
      }
      res.status(200).json({
        success: true,
        message: "successfully compared your nutrients with recipe",
        comparedInfo,
      });
    } catch (error) {
      return next(new Errorhandler(500, "Internal server error"));
    }
  }
);

export const compareRecipeBynutrients = catchaysynerror(
  async (req, res, next) => {
    try {
      const { recipeId1, recipeId2 } = req.query;
      if (!recipeId1 || !recipeId2) {
        return next(
          new Errorhandler(
            404,
            "missing any one recipe id please select both recipes"
          )
        );
      }
      const recipe1 = await Recipe.findById(recipeId1);
      const recipe2 = await Recipe.findById(recipeId2);
      if (!recipe1 || !recipe2) {
        return next(new Errorhandler(404, "one or both recipes not found "));
      }
      const comparedInfo = {
        calories: {
          value: compareNutrients(
            recipe1.nutritionalInfo.calories,
            recipe2.nutritionalInfo.calories
          ),
          leader: getNutrientLeader(
            recipe1.nutritionalInfo.calories,
            recipe2.nutritionalInfo.calories,
            recipe1,
            recipe2
          ),
        },
        protein: {
          value: compareNutrients(
            recipe1.nutritionalInfo.protein,
            recipe2.nutritionalInfo.protein
          ),
          leader: getNutrientLeader(
            recipe1.nutritionalInfo.protein,
            recipe2.nutritionalInfo.protein,
            recipe1,
            recipe2
          ),
        },
        carbohydrates: {
          value: compareNutrients(
            recipe1.nutritionalInfo.carbohydrates,
            recipe2.nutritionalInfo.carbohydrates
          ),
          leader: getNutrientLeader(
            recipe1.nutritionalInfo.carbohydrates,
            recipe2.nutritionalInfo.carbohydrates,
            recipe1,
            recipe2
          ),
        },
        fats: {
          value: compareNutrients(
            recipe1.nutritionalInfo.fats,
            recipe2.nutritionalInfo.fats
          ),
          leader: getNutrientLeader(
            recipe1.nutritionalInfo.fats,
            recipe2.nutritionalInfo.fats,
            recipe1,
            recipe2
          ),
        },
      };
      function compareNutrients(recipe1values, recipe2values) {
        return Math.abs(recipe1values - recipe2values);
      }
      function getNutrientLeader(val1, val2) {
        if (val1 > val2) {
          return "Recipe1";
        } else if (val2 > val1) {
          return "Recipe2";
        } else {
          return "Both";
        }
      }
      res.status(200).json({
        success: true,
        message: "successfully ",
        comparedInfo,
      });
    } catch (error) {
      return next(new Errorhandler(500, "Internal server error"));
    }
  }
);
export const GetRecipesAccordingtoMissingIngredients = catchaysynerror(
  async (req, res, next) => {
    try {
      const { MissingIngredients } = req.body;
      const Allrecipes = await Recipe.find();
      if (Allrecipes.length <= 0) {
        return next(new Errorhandler(404, "recipe not found "));
      }
      const Recipesfiltered = Allrecipes.filter((recipe) => {
        const recipeIngredients = recipe.ingredients.map((ingredient) =>
          ingredient.name.toLowerCase()
        );
        const presentingredient = MissingIngredients.find((missingIngredient) =>
          recipeIngredients.includes(missingIngredient.toLowerCase())
        );
        console.log(presentingredient);
        return !presentingredient;
      });
      if (Recipesfiltered.length <= 0) {
        return next(
          new Errorhandler(
            404,
            "No recipes found that require only your missing ingredients."
          )
        );
      }
      res.status(200).json({
        success: true,
        Recipesfiltered,
      });
    } catch (error) {
      next(error);
    }
  }
);

export const GetAdjustedRecipe = catchaysynerror(async (req, res, next) => {
  try {
    const { recipeId } = req.query;
    const { persons } = req.query;
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return next(new Errorhandler(404, "recipe not found "));
    }

    const AdjustedIngredients = recipe.ingredients.map((ingredient) => ({
      ...ingredient.toObject(),
      quantity: AdjustedIngredientQuantity(ingredient.quantity, persons),
    }));
    const AdjustedRecipe = {
      ...recipe.toObject(),
      ingredients: AdjustedIngredients,
    };
    res.status(200).json({
      success: true,
      message:
        "successfully updated recipe according to number of persons as you given ",
      AdjustedRecipe,
    });
  } catch (error) {
    return next(new Errorhandler(500, "Internal server error "));
  }
});
export const LikeRecipebyuser = catchaysynerror(async (req, res, next) => {
  // try {
    const { recipeId } = req.params;

    const user = await User.findById(req.user._id);
    const recipe = await Recipe.findById(recipeId);
    console.log(user);
    const existlike = user.likedrecipes.includes(recipeId);
    console.log(existlike);
    if (existlike) {
      return next(new Errorhandler(404, "already exist your like"));
    }
    recipe.Likes = recipe.Likes + 1;
    await recipe.save();
    user.likedrecipes.push(recipe._id);
    await user.save();

    res.status(200).json({
      success: true,
      message: "successfully added your like to this recipe",
    });
  // } catch (error) {
  //   return next(new Errorhandler(500, "Internal server error"));
  // }
});
