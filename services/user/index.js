import { Service } from "../../entities/service/index.js";
import UserModel from "../../db/models/users/index.js";
class UserService extends Service {
  constructor() {
    super("UserService");
  }

  async getAll() {
    return await UserModel.findAll();
  }

  async getOne(id) {
    if (!id) return {};
    return await UserModel.findOne({ where: { id } });
  }
}

export default new UserService();
