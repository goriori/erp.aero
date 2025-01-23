import { validJwtToken, getJwtInfo } from "../utils/jwt/index.js";
import { parseJSON, createJSON } from "../utils/json/index.js";
import { checkDuplicateUserAgent } from "../utils/auth/index.js";
import { ERRORS } from "../configs/messages/error.config.js";
import { ERROR_CODES } from "../configs/codes/error.config.js";
import UserService from "../services/user/index.js";

const checkHeaders = (headers) => {
  if (!headers.authorization) return false;
  return true;
};

const checkToken = (token) => {
  if (!token) return false;
  if (!validJwtToken(token)) return false;
  return true;
};

const checkTokenPayload = (payload) => {
  if (!payload) return false;
  if (!payload.id) return false;
  return true;
};

export const authMiddleware = async (req, res, next) => {
 
  if (!checkHeaders(req.headers))
    return res.status(ERROR_CODES.FORBIDDEN).json({ error: ERRORS.FORBIDDEN });
 
  const [type, token] = req.headers.authorization.split(" ");
 
  if (!checkToken(token))
    return res.status(ERROR_CODES.FORBIDDEN).json({ error: ERRORS.FORBIDDEN });
 
  const payload = getJwtInfo(token);

  if (!checkTokenPayload(payload))
    return res.status(ERROR_CODES.FORBIDDEN).json({ error: ERRORS.FORBIDDEN });
 
  const user = await UserService.getOne(payload.id);
  const userAgents = parseJSON(parseJSON(user.userAgents));

  if (!checkDuplicateUserAgent(payload.userAgent, userAgents))
    return res.status(ERROR_CODES.FORBIDDEN).json({ error: ERRORS.FORBIDDEN });
 
  if (!user.isAuth)
    return res.status(ERROR_CODES.FORBIDDEN).json({ error: ERRORS.FORBIDDEN });
 
  next();
};
