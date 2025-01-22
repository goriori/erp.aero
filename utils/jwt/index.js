import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = "test";
const ALGORITHM = "shhhhh";
const option = {};

const generateJwtToken = (payload, time) => {
  try {
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: time, ...option });
    return token;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getJwtInfo = (token) => {
  try {
    if (!validJwtToken(token)) return false;
    const { iat, exp, ...payload } = jwt.verify(token, SECRET_KEY);
    return payload;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const validJwtToken = (token) => {
  try {
    const payload = jwt.verify(token, SECRET_KEY);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export { generateJwtToken, getJwtInfo, validJwtToken };
