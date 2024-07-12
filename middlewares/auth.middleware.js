import User from "../models/user.models.js";
import Errorhandler from "../utils/Errorhandler.utils.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  const Token = req.cookies.token;
  if (!Token) {
    return next(new Errorhandler(404, "please Login To Continue"));
  }
  const decodedData = jwt.verify(Token, "yashkasecret");
  // console.log("this is decoded data :", decodedData);

  const user = await User.findById(decodedData.id);
  if (!user) {
    return next(
      new Errorhandler(404, "please login to continue user not found ")
    );
  }
  req.user = user;
  next();
};
