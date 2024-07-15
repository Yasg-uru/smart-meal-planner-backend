import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

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
    type: String,
    required: [true, "please Enter password"],
    minLength: [4, "your password should be atleast of length 4 "],
    // maxLength: [50, "your password should not be greater than 15"],
  },
  PhotoUrl: {
    type: String,
  },
  allergies: [
    {
      type: String,
    },
  ],
  likedrecipes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Recipe",
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
  ResetPasswordToken:{
    type:String 
  },
  ResetPasswordTokenExpire:{
    type:Date
  }
});
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  }
  return next();
});
userSchema.pre("save", function (next) {
  if (this.nutritionalGoals.vitamins) {
    //now traversing and removing all the spaces from it
    this.nutritionalGoals.vitamins = this.nutritionalGoals.vitamins.map(
      (vitamins) => {
        return vitamins.replace(/\s+/g, " ").trim().toLowerCase();
      }
    );
  }

  this.nutritionalGoals.minerals = this.nutritionalGoals.minerals.map(
    (mineral) => {
      return mineral.replace(/\s+/g, " ").trim().toLowerCase();
    }
  );
  next();
});

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, "yashkasecret", { expiresIn: "10d" });
};
userSchema.methods.ComparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};
userSchema.methods.getResetToken=function (){
  return  crypto.randomBytes(20).toString('hex');

}
const usermodel = model("User", userSchema);
export default usermodel;
