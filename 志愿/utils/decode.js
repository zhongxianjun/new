import base64 from "./base64.min.js";
function decode(obj) {
  const res = {};

  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    if (Array.isArray(val)) {
      res[key] = [];
      val.forEach((item) => {
        res[key].push(decode(item));
      })
    } else if (val instanceof Object) {
      res[key] = decode(val);
    } else {
      res[key] = base64.decode(val);
    }
  });
  return res;
}
module.exports = decode;