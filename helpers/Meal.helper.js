import { ObjectId } from "mongodb";
import Recipe from "../models/Recipe.model.js";
export async function FindFilteredRecipes(
  meals,
  dietaryPreferences,
  allergies
) {
  function getrecipeids(daymeals){
    return daymeals.recipes;
  }
  const recipeIds = meals.flatMap(getrecipeids);
console.log(recipeIds);

  let query = { _id: { $in: recipeIds } };
  // if (dietaryPreferences.length > 0) {
  //   query["dietaryLabels"] = { $in: dietaryPreferences };
  // }
  if (allergies.length > 0) {
    query["ingredients.name"] = { $nin: allergies };
  }
  console.log("this is a query structure ",query);
  return (await Recipe.find(query));
}

export async function generateShoppingList(recipes) {
  const ShoppingList = [];
  for (const recipe of recipes) {
    for (const ingredients of recipe.ingredients) {
      const existingingredients = ShoppingList.find(
        (item) => item.name === ingredients.name
      );
      if (existingingredients) {
        existingingredients.quantity += ingredients.quantity;
      } else {
        ShoppingList.push({
          name: ingredients.name,
          quantity: ingredients.quantity,
          isChecked: false,
        });
      }
    }
  }
  return ShoppingList;
}
