const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");

/**
 * Check is the user login to this website or not 
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * 
 * @return void
 */
module.exports = async (req, res, next) => {
  if (!req.cookies.access_token) {
    return res
      .status(403)
      .json({ message: "You have not access to this route" });
  }

  const token = jwt.verify(
    req.cookies.access_token,
    process.env.ACCESS_TOKEN_SECRET
  );

  const user = await userModel.findOne({ email: token.email });

  if (!user) {
    return res.status(403).json({ message: "User not found" });
  }

  // Save user's/admin's information into req.user
  req.user = user;

  next();
};
