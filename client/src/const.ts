export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Custom login URL - no OAuth needed
export const getLoginUrl = () => {
  return "/login";
};

// Always return false since we're not using OAuth
export const isOAuthConfigured = () => {
  return false;
};
