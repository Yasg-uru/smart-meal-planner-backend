import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";
const Recipeschema = new Schema({
  title: {
    type: String,
    required: [true, "please enter the title of the recipe"],
  },
  imageurl: {
    type: String,
  },
  description: {
    type: String,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  ingredients: [
    {
      name: String,
      quantity: String,
    },
  ],
  instructions: [
    {
      step: Number,
      description: String,
    },
  ],
  cuisine: {
    type: String,
  },
  mealType: {
    type: String,
    enum: ["lunch", "dinner", "snack", "breakfast"],
  },
  NumberofPersons: {
    type: Number,
    required: [true, "please enter Number of persons "],
  },
  Likes: {
    type: Number,
    default: 0,
  },
  dietaryLabels: [String],
  nutritionalInfo: {
    calories: { type: Number },
    protein: { type: Number },
    carbohydrates: { type: Number },
    fats: { type: Number },
    vitamins: [{ type: String }],
    minerals: [{ type: String }],
  },
});
Recipeschema.index({ name: "text", description: "text" });
Recipeschema.plugin(paginate);
const recipemodel = model("Recipe", Recipeschema);
export default recipemodel;
