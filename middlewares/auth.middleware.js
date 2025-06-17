const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");

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

  req.user = user;

  next();
};
