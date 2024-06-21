import { Schema, model } from "mongoose";

const MealPlaneSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "userid is required"],
  },
  startDate: {
    type: Date,
    required: [true, "start date is required"],
  },
  endDate: {
    type: Date,
    required: [true, "end Date is required"],
  },
  meals: [
    {
      day: {
        type: Date,
        required: [true, "date is required"],
      },
      recipes: [
        {
          type: Schema.Types.ObjectId,
          ref: "Recipe",
        },
      ],
    },
  ],
});
const mealplanemodel=new model("Mealplane",MealPlaneSchema);
export default mealplanemodel;
