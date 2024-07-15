import catchaysynerror from "../middlewares/Catchasynerror.middleware.js";
import User from "../models/user.models.js";
import Errorhandler from "../utils/Errorhandler.utils.js";
import SendMail from "../utils/SendEmail.js";
import SendToken from "../utils/SendToken.utils.js";
export const RegisterUser = catchaysynerror(async (req, res, next) => {
  // try {
  const { Name, Email } = req.body;
  const exisitinguser = await User.findOne({ $or: [{ Name }, { Email }] });
  console.log(
    "this is existing user: ant this is a data :",
    exisitinguser,
    req.body
  );
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
    console.log("this is email and password", Email, password);
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

export const forgotPassword = catchaysynerror(async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(new Errorhandler(404, "Please enter email first "));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(new Errorhandler(404, "User Not Found "));
    }

    const Token = user.getResetToken();
    user.ResetPasswordToken = Token;
    user.ResetPasswordTokenExpire = Date.now() + 3600000;
    await user.save();
    const MailOptions = {
      to: user.email,
      from: "passwordreset@example.com",
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
    Please click on the following link, or paste this into your browser to complete the process:\n\n
    http://${req.headers.host}/reset/${Token}\n\n
    If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };
    const Response = SendMail(MailOptions);
    console.log("this is a response:", Response);
    res.status(200).json({
      success: true,
      message: "Mail Sent Successfully",
    });
  } catch (error) {
    return next(new Errorhandler(500,"Internal server Error"));
  }
});

export const ResetPassword = catchaysynerror(async (req, res, next) => {
  try {
    const { token } = req.params;
    const password = req.body;
    const user = await User.findOne({
      ResetPasswordToken: token,
      ResetPasswordTokenExpire: { $gt: new Date() },
    });
    if (!user) {
      return next(new Errorhandler(404, "user not found "));
    }
    user.password = password;
    user.ResetPasswordToken = undefined;
    user.ResetPasswordTokenExpire = undefined;
    await user.save();
    SendToken(user, res, 200);
  } catch (error) {
    return next(new Errorhandler(500, "internal server Error"));
  }
});
