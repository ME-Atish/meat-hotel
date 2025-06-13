const jwt = require("jsonwebtoken");

exports.generateAccessToken = (email) => {
  const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
    algorithm: "HS512",
    expiresIn: "20s",
  });
  return token;
};

exports.generateRefreshToken = (email) => {
  const token = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
    algorithm: "HS512",
    expiresIn: "30d",
  });
  return token;
};
