module.exports = (fn) => {
  console.log("wrapAsync received a function");

  return function (req, res, next) {
    console.log("wrapAsync returned function START");

    fn(req, res, next).catch(next);

    console.log("wrapAsync returned function END");
  };
};
