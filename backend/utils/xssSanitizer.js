const xss = require("xss");

function clean(obj) {
  let newObj = {};
  Object.keys(obj).forEach((el) => {
    // TODO: only works with string it does not include deep sanitization
    if (typeof obj === "string") {
      newObj = xss(obj);
      return;
    }
    if (typeof obj[el] !== "string") {
      newObj[el] = obj[el];
      return;
    }

    newObj[el] = xss(obj[el]);
  });
  return newObj;
}
function xssSanitizer() {
  return (req, res, next) => {
    if (req.body) req.body = clean(req.body);
    if (req.query) req.query = clean(req.query);
    if (req.params) req.params = clean(req.params);

    next();
  };
}

module.exports = xssSanitizer;
