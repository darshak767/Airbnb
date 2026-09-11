class ExpressError extends Error {
  constructor(statusCode, message) {
    console.log("ExpressError constructor START");

    super(message);

    this.statusCode = statusCode;
    this.message = message;

    console.log("ExpressError constructor END");
  }
}

module.exports = ExpressError;
