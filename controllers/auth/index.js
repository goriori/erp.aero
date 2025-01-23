import dotenv from "dotenv";
dotenv.config();
import { ERRORS } from "../../configs/messages/error.config.js";
import { ERROR_CODES } from "../../configs/codes/error.config.js";
import { SUCCESS } from "../../configs/messages/success.config.js";
import { SUCCESS_CODES } from "../../configs/codes/success.config.js";
import { Controller } from "../../entities/controller/index.js";
import { createJSON, parseJSON } from "../../utils/json/index.js";
import { checkDuplicateUserAgent } from "../../utils/auth/index.js";
import { validationResult } from "express-validator";
import {
  generateJwtToken,
  getJwtInfo,
  validJwtToken,
} from "../../utils/jwt/index.js";
import {
  createSHA256Hash,
  validSHA256Hashs,
} from "../../utils/sha256/index.js";
import { parseCookie } from "../../utils/cookie/index.js";
import UserModel from "../../db/models/users/index.js";

class AuthController extends Controller {
  constructor() {
    super("AuthController");
  }

  async signin(req, res) {
    const valid = validationResult(req);
    if (valid.isEmpty()) {
      const cookie = parseCookie(req.headers.cookie);
      const { id, password } = req.body;
      const user = await UserModel.findOne({ where: { id } });
      if (!user) {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .json({ error: ERRORS.INVALID_ID_OR_PASSWORD });
      }
      if (!validSHA256Hashs(createSHA256Hash(password), user.password)) {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .json({ error: ERRORS.INVALID_ID_OR_PASSWORD });
      }
      if (!validJwtToken(user.refreshToken)) {
        user.refreshToken = generateJwtToken({ id: user.id }, "10d");
      }
      if (!user.userAgents) {
        const userAgents = [];
        userAgents.push(req.headers["user-agent"]);
        user.userAgents = createJSON(userAgents);
      } else {
        const userAgents = parseJSON(parseJSON(user.userAgents));
        if (!checkDuplicateUserAgent(req.headers["user-agent"], userAgents))
          userAgents.push(req.headers["user-agent"]);
        user.userAgents = createJSON(userAgents);
      }
      user.isAuth = true;
      await user.save();
      if (!cookie)
        res.cookie("refreshToken", user.refreshToken, { httpOnly: true });
      return res.json({
        data: {
          accessToken: generateJwtToken(
            { id: user.id, userAgent: req.headers["user-agent"] },
            user.expiresIn || process.env.JWT_ACCESS_EXPIRED_TIME,
          ),
        },
      });
    }
    return res.send({ errors: valid.array() });
  }

  async signup(req, res) {
    const valid = validationResult(req);
    if (valid.isEmpty()) {
      const { id, password } = req.body;
      const accessToken = generateJwtToken(
        { id },
        process.env.JWT_ACCESS_EXPIRED_TIME,
      );
      const refreshToken = generateJwtToken(
        { id },
        process.env.JWT_REFRESH_EXPIRED_TIME,
      );
      const user = {
        id,
        password: createSHA256Hash(password),
        refreshToken,
        expiresIn: process.env.JWT_ACCESS_EXPIRED_TIME,
      };
      const isExistUser = await UserModel.findOne({ where: { id: user.id } });
      if (isExistUser)
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .json({ error: ERRORS.USER_EXIST });
      await UserModel.create(user);
      res.cookie("refreshToken", refreshToken, { httpOnly: true });
      return res.status(SUCCESS_CODES.CREATED).json({
        data: {
          accessToken,
        },
      });
    }
    return res.send({ errors: valid.array() });
  }

  async newToken(req, res) {
    const cookie = parseCookie(req.headers.cookie);
    if (!cookie) {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .json({ error: ERRORS.BAD_REQUEST });
    }
    const refreshToken = cookie.find((val) => val.key === "refreshToken");
    if (!refreshToken) {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .json({ error: ERRORS.BAD_REQUEST });
    }
    const { id } = getJwtInfo(refreshToken.value);
    if (!id) {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .json({ error: ERRORS.BAD_REQUEST });
    }
    const user = await UserModel.findOne({ where: { id } });
    if (!user) {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .json({ error: ERRORS.BAD_REQUEST });
    }
    if (user.refreshToken !== refreshToken.value) {
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .json({ error: ERRORS.BAD_REQUEST });
    }
    const newRefreshToken = generateJwtToken({ id: user.id }, "10d");
    user.refreshToken = newRefreshToken;
    await user.save();
    res.cookie("refreshToken", user.refreshToken, { httpOnly: true });
    return res.status(SUCCESS_CODES.OK).json({
      data: {
        accessToken: generateJwtToken(
          { id: user.id },
          user.expiresIn || process.env.JWT_ACCESS_EXPIRED_TIME,
        ),
      },
    });
  }

  async info(req, res) {
    const [type, token] = req.headers.authorization.split(" ");
    return res.status(SUCCESS_CODES.OK).json({
      data: {
        info: getJwtInfo(token),
      },
    });
  }

  async logout(req, res) {
    const [type, token] = req.headers.authorization.split(" ");
    const { id, userAgent } = getJwtInfo(token);
    // Думаю на этом моменте стоит сбросить авторизацию для всех устройств, больше всего будет походить на попытку взлома или хака аккаунтаы
    if (!userAgent)
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .json({ error: ERRORS.BAD_REQUEST });
    const user = await UserModel.findOne({ where: { id } });
    let userAgents = parseJSON(parseJSON(user.userAgents));
    if (checkDuplicateUserAgent(userAgent, userAgents)) {
      userAgents = userAgents.filter((agent) => agent !== userAgent);
    }
    if (!userAgents.length) {
      user.isAuth = false;
      user.userAgents = null;
    } else {
      user.userAgents = userAgents;
    }
    user.refreshToken = null;
    await user.save();
    res.clearCookie("refreshToken");
    return res.status(SUCCESS_CODES.OK).json({
      data: {
        msg: SUCCESS.USER_LOGOUT,
      },
    });
  }

}

export default new AuthController();
