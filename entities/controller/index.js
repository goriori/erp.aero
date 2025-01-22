import FileWriter from "../file-writer/index.js";

export class Controller {
  constructor(name, model) {
    this.name = name;
    this.model = model;
  }
  async getAll() {
    return await this.model.findAll();
  }
  async getOne(id) {
    return await this.model.findOne({ where: { id } });
  }
  async update(id, data) {
    const obj = await this.getOne(id);
    if (!obj) return false;
    obj.update(data);
    return true;
  }
  async delete(id) {
    const obj = await this.getOne(id);
    if (!obj) return false;
    await obj.destroy();
    return true;
  }
  async logError(error) {
    const time = new Date();
    const message = `[${time}]: ${error.toString()}`;
    FileWriter.writeToFile("/logs/error/error.txt", message);
  }
}
