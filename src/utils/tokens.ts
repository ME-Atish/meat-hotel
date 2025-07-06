/**
 * Returns the access token's secret from the environment variables.
 * 
 * @returns {string} the access token's secret value in the environment variables.
 * @throws {Error} if the access token's secret is not defined in the environment variables.
 */
export const getAccessTokenSecret = (): string => {
  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!secret) {
    throw new Error(
      "ACCESS_TOKEN_SECRET is not defined in environment variables!"
    );
  }

  return secret;
}

/**
 * Returns the refresh token's secret from the environment variables.
 * 
 * @returns {string} the refresh token's secret value in the environment variables.
 * @throws {Error} if the access token's secret is not defined in the environment variables. 
 */
export const getRefreshTokenSecret = (): string => {
  const secret = process.env.REFRESH_TOKEN_SECRET;

  if (!secret) {
    throw new Error(
      "REFRESH_TOKEN_SECRET is not defined in environment variables!"
    );
  }

  return secret;
}