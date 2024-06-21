class Errorhandler extends Error {
  constructor(statuscode, message) {
    super(message);
    this.statuscode = statuscode;
    this.message = message;
    Error.captureStackTrace(this, this.contstructor);
  }
}
export const ErrorhandlerMiddleware = (err, res, res, next) => {
  if (err instanceof Errorhandler) {
    return res.status(err.statuscode).json({
      message: err.message,
    });
  }
  return res.status(500).json({
    message: "Internal Server Error",
  });
};
export default Errorhandler;

