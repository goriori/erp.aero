import { validJwtToken, getJwtInfo } from "../utils/jwt/index.js";
import { ERRORS } from "../configs/messages/error.config.js";
import { ERROR_CODES } from "../configs/codes/error.config.js";
import UserService from "../services/user/index.js";

export const authMiddleware = async (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(ERROR_CODES.FORBIDDEN).json({ error: ERRORS.FORBIDDEN });
  const [type, token] = req.headers.authorization.split(" ");
  if (!validJwtToken(token))
    return res.status(ERROR_CODES.FORBIDDEN).json({ error: ERRORS.FORBIDDEN });
  const payload = getJwtInfo(token);
  if (!payload.id)
    return res.status(ERROR_CODES.FORBIDDEN).json({ error: ERRORS.FORBIDDEN });
  const user = await UserService.getOne(payload.id);
  if (!user.isAuth)
    return res.status(ERROR_CODES.FORBIDDEN).json({ error: ERRORS.FORBIDDEN });
  next();
};
