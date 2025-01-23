export const checkDuplicateUserAgent = (userAgent, userAgents) => {
  const isExist = userAgents.find((agent) => agent === userAgent);
  if (!isExist) return false;
  return true;
};
