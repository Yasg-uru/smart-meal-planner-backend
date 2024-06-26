const SendToken = function (user, res, statuscode) {
  const Token = user.getJwtToken();
  const options = {
    expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    httpOnly: false,
    sameSite: "none",
    secure: true,
  };
  res.cookie("token", Token, options).status(statuscode).json({
    success: true,
    user,
    Token,
  });
};
export default SendToken;
