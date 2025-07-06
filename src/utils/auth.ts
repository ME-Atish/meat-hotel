import jwt from "jsonwebtoken";
import { getAccessTokenSecret, getRefreshTokenSecret } from "./tokens";

/**
 * Generate access token
 * 
 * @param {string} email 
 * 
 * @return {string} access token
 */
export const generateAccessToken = (email: string): string => {
  const secret = getAccessTokenSecret();

  const token = jwt.sign({ email }, secret, {
    algorithm: "HS512",
    expiresIn: "20s",
  });

  return token;
};

/**
 * Generate refresh token
 * 
 * @param string email 
 * 
 * @return refresh token
 */
export const generateRefreshToken = (email: string): string => {
  const secret = getRefreshTokenSecret();

  const token = jwt.sign({ email }, secret, {
    algorithm: "HS512",
    expiresIn: "30d",
  });

  return token;
};
