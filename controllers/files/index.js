import fs from "fs";
import path from "path";
import { ERRORS } from "../../configs/messages/error.config.js";
import { ERROR_CODES } from "../../configs/codes/error.config.js";
import { SUCCESS } from "../../configs/messages/success.config.js";
import { SUCCESS_CODES } from "../../configs/codes/success.config.js";
import { Controller } from "../../entities/controller/index.js";
import { validationResult } from "express-validator";
import { generateJwtToken, validJwtToken } from "../../utils/jwt/index.js";
import { getExtendFile, getFileName } from "../../utils/files/index.js";
import FileModel from "../../db/models/files/index.js";

const __dirname = path.resolve();

class FileController extends Controller {
  constructor() {
    super("FileController");
  }

  async getFiles(req, res) {
    const files = await FileModel.findAll();
    return res.status(SUCCESS_CODES.OK).json({
      data: {
        files,
      },
    });
  }

  async getFile(req, res) {
    const { id } = req.params;
    const file = await FileModel.findOne({ where: { id } });
    if (!file)
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .json({ error: ERRORS.NOT_FOUND });
    return res.status(SUCCESS_CODES.OK).json({
      data: {
        file,
      },
    });
  }

  async uploadFile(req, res) {
    if (!req.file)
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .json({ error: ERRORS.BAD_REQUEST });
    const { originalname, mimetype, size, filename } = req.file;
    const file = {
      name: getFileName(originalname),
      fileName: filename,
      extend: getExtendFile(mimetype),
      mimeType: mimetype,
      size,
    };
    await FileModel.create(file);
    return res.status(SUCCESS_CODES.OK).json({
      data: {
        msg: SUCCESS.FILE_UPLOAD,
      },
    });
  }

  async downloadFile(req, res) {
    const { id } = req.params;
    const file = await FileModel.findOne({ where: { id } });
    if (!file)
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .json({ error: ERRORS.NOT_FOUND });

    return res.download(`${__dirname}/uploads/${file.fileName}`);
  }

  async updateFile(req, res) {
    if (!req.file)
      return res
        .status(ERROR_CODES.BAD_REQUEST)
        .json({ error: ERRORS.BAD_REQUEST });
    const { id } = req.params;
    const file = await FileModel.findOne({ where: { id } });
    if (!file)
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .json({ error: ERRORS.NOT_FOUND });
    const { originalname, mimetype, size, filename } = req.file;
    const newFile = {
      name: getFileName(originalname),
      fileName: filename,
      extend: getExtendFile(mimetype),
      mimeType: mimetype,
      size,
    };
    await file.update(newFile);
    return res.status(SUCCESS_CODES.OK).json({
      data: {
        msg: SUCCESS.FILE_UPDATED,
      },
    });
  }

  async deleteFile(req, res) {
    const { id } = req.params;
    const file = await FileModel.findOne({ where: { id } });
    if (!file)
      return res
        .status(ERROR_CODES.NOT_FOUND)
        .json({ error: ERRORS.NOT_FOUND });
    await file.destroy();
    return res
      .status(SUCCESS_CODES.OK)
      .json({ data: { msg: SUCCESS.FILE_DELETED } });
  }
}

export default new FileController();
