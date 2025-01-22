import { promises as fs } from "fs";
import path from "path";

export default class FileWriter {
  static async writeToFile(filePath, data) {
    try {
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });

      await fs.writeFile(filePath, data, "utf-8");
      console.log(`Data successfully written to ${filePath}`);
    } catch (error) {
      console.error(`Failed to write to file: ${error.message}`);
    }
  }
}
