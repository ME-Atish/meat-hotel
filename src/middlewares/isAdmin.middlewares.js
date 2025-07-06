const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

/**
 * Check is the users that send request admin or not
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @return void
 */
module.exports = async (req, res, next) => {
  if (!req.cookies.refresh_token) {
    return res
      .status(403)
      .json({ message: "You have not access to this route" });
  }

  const token = jwt.verify(
    req.cookies.refresh_token,
    process.env.REFRESH_TOKEN_SECRET
  );
  const user = await userModel.findOne({ email: token.email });

  if (!user) {
    return res.status(403).json({ Message: "User not found" });
  }

  if (user.role === "USER") {
    return res
      .status(403)
      .json({ message: "You have not access to this route" });
  }

  // Save the user's/admin's information in req.user
  req.user = user;

  next();
};
