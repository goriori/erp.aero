import { promises as fs } from "fs";
import { dirname } from "path";

export const createFile = async (filePath, content = "") => {
  const dir = dirname(filePath);
  try {
    await fs.mkdir(dir, { recursive: true });

    await fs.writeFile(filePath, content, "utf8");

    console.log(`Файл создан: ${filePath}`);
  } catch (error) {
    console.error(`Ошибка при создании файла: ${error.message}`);
    throw error;
  }
};

export const readFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    console.log(`Файл прочитан: ${filePath}`);
    return data;
  } catch (error) {
    console.error(`Ошибка при чтении файла: ${error.message}`);
    throw error;
  }
};

export const getFileName = (filename) => {
  const [name, extend] = filename.split(".");
  return name;
};

export const getExtendFile = (mimeType) => {
  const [mime, type] = mimeType.split("/");
  if (type) return type;
  else null;
};
