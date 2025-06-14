module.exports = (req, res, next) => {
  if (!req.cookies.access_token) {
    return res
      .status(403)
      .json({ message: "You have not access to this route" });
  }
  next();
};
