import catchaysynerror from "../middlewares/Catchasynerror.middleware.js";
import Errorhandler from "../utils/Errorhandler.utils.js";
import UploadOnCloudinary from "../utils/cloudinary.utils.js";
import Recipe from "../models/Recipe.model.js";
import paginate from "mongoose-paginate";

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
    const { searchterm } = req.params;
    const query = { $text: { $search: searchterm } };
    const recipes = await Recipe.find(query);
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
      const page = parseInt(req.params.page) || 1;
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
      const { recipeId } = req.params;
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
        return recipeNutrients.every((nuitrients) =>
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
      const { recipeId1, recipeId2 } = req.body;
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
            recipe2.nutritionalInfo.calories
          ),
        },
        protein: {
          value: compareNutrients(
            recipe1.nutritionalInfo.protein,
            recipe2.nutritionalInfo.protein
          ),
          leader: getNutrientLeader(
            recipe1.nutritionalInfo.protein,
            recipe2.nutritionalInfo.protein
          ),
        },
        carbohydrates: {
          value: compareNutrients(
            recipe1.nutritionalInfo.carbohydrates,
            recipe2.nutritionalInfo.carbohydrates
          ),
          leader: getNutrientLeader(
            recipe1.nutritionalInfo.carbohydrates,
            recipe2.nutritionalInfo.carbohydrates
          ),
        },
        fats: {
          value: compareNutrients(
            recipe1.nutritionalInfo.fats,
            recipe2.nutritionalInfo.fats
          ),
          leader: getNutrientLeader(
            recipe1.nutritionalInfo.fats,
            recipe2.nutritionalInfo.fats
          ),
        },
      };
      function compareNutrients(recipe1values, recipe2values) {
        return Math.abs(recipe1values - recipe2values);
      }
      function getNutrientLeader(val1, val2) {
        if (val1 > val2) {
          return val1;
        } else if (val2 > val1) {
          return val2;
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
export const GetRecipesAccordingtoIngredients = catchaysynerror(
  async (req, res, next) => {
    try {
      const { MissingIngredients } = req.body;
      const Allrecipes = await Recipe.find();
      if (Allrecipes.length <= 0) {
        return next(new Errorhandler(404, "recipe not found "));
      }
      const Recipesfiltered = Allrecipes.filter((recipe) => {
        return MissingIngredients.every((missingingredient) =>
          recipe.ingredients.includes(missingingredient)
        );
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
