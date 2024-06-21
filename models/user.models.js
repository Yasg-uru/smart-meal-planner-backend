import { Schema, model, mongo } from "mongoose";
const userSchema = new Schema({
  Name: {
    type: String,
    required: [true, "please Enter name of the user"],
  },
  Email: {
    type: String,
    required: [true, "Please Enter your email"],
    unique: true,
  },
  password: {
    type: string,
    required: [true, "please Enter password"],
    minLength: [4, "your password should be atleast of length 4 "],
    maxLength: [15, "your password should not be greater than 15"],
  },
  PhotoUrl: {
    type: String,
  },
  allergies: [
    {
      type: String,
    },
  ],
  dietaryPreferences: [{ type: String }],
  nutritionalGoals: {
    calories: { type: Number },
    protein: { type: Number },
    carbohydrates: { type: Number },
    fats: { type: Number },
    vitamins: [{ type: String }],
    minerals: [{ type: String }],
  },
});
const usermodel = model("User", userSchema);
export default usermodel;
