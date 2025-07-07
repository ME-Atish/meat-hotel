import jwt from "jsonwebtoken";

/**
 * Generating access token
 *
 * @param string email
 *
 * @return access token
 */

export const generateAccessToken = (email: string) => {
  const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET!, {
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

export const generateRefreshToken = (email: string) => {
  const token = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET!, {
    algorithm: "HS512",
    expiresIn: "30d",
  });
  return token;
};

/**
 * Generating remember me token
 * @param string email
 *
 * @return remember me token
 */
export const generateRememberMeToken = (email: string) => {
  const token = jwt.sign({ email }, process.env.REMEMBER_ME_TOKEN_SECRET!, {
    algorithm: "HS512",
    expiresIn: "30d",
  });
  return token;
};
