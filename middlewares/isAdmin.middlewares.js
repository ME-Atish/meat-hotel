const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

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

  if (user.role === "USER") {
    return res
      .status(403)
      .json({ message: "You have not access to this route" });
  }

  req.user = user;

  next();
};
