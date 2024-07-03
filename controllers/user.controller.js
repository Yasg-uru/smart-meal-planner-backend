import catchaysynerror from "../middlewares/Catchasynerror.middleware.js";
import User from "../models/user.models.js";
import Errorhandler from "../utils/Errorhandler.utils.js";
import SendToken from "../utils/SendToken.utils.js";
export const RegisterUser = catchaysynerror(async (req, res, next) => {
  // try {
  const { Name, Email } = req.body;
  const exisitinguser = await User.findOne({ $or: [{ Name }, { Email }] });
  console.log("this is existing user: ant this is a data :", exisitinguser,req.body);
  if (exisitinguser) {
    return next(
      new Errorhandler(404, "Already user Exist with this email or username")
    );
  }

  const newuser = await User.create(req.body);
  SendToken(newuser, res, 200);
  // } catch (error) {
  //   return next(new Errorhandler(500, "Internal server error "));
  // }
});
export const Login = catchaysynerror(async (req, res, next) => {
  try {
    const { Email, password } = req.body;
    if (!Email || !password) {
      return next(new Errorhandler(404, "Invalid Credentials"));
    }
    const user = await User.findOne({ Email });
    if (!user) {
      return next(new Errorhandler(404, "User not found"));
    }
    const comparepassword = user.ComparePassword(password);
    if (!comparepassword) {
      return next(new Errorhandler("invalid Email or password"));
    }
    SendToken(user, res, 200);
  } catch (error) {
    return next(new Errorhandler(500, "Internal Server Error"));
  }
});
