import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { sequelize } from "./db/index.js";

import AuthRouter from "./routers/auth.router.js";
import FilesRouter from "./routers/files.router.js";

dotenv.config();

const __dirname = path.resolve();

const app = express();
const port = process.env.PORT || 8000;
const corsOption = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("files"));

app.use("/api", AuthRouter);
app.use("/api", FilesRouter);

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
