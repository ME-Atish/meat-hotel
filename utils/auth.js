const jwt = require("jsonwebtoken");

/**
 * Generating access token
 * 
 * @param string email 
 * 
 * @return access token
 */

exports.generateAccessToken = (email) => {
  const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
    algorithm: "HS512",
    expiresIn: "20s",
  });
  return token;
};

/**
 * Generating refresh token
 * 
 * @param string email 
 * 
 * @return refresh token
 */

exports.generateRefreshToken = (email) => {
  const token = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
    algorithm: "HS512",
    expiresIn: "30d",
  });
  return token;
};
