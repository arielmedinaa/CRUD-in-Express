import * as userService from "../service/user.service.js";
import { response } from "../../res/res.js";
import { UserModel } from "../model/user.model.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await userService.insertUsers(
      new UserModel(null, name, email, password)
    );

    response(res, 201, user);
  } catch (error) {
    response(res, 500, error.message);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const filters = {
        name: req.body.name,
        email: req.body.email,
        limit: parseInt(req.body.limit),
        offset: parseInt(req.body.offset)
    }
    const users = await userService.getAllUsers(filters);
    response(res, 200, users);
  } catch (error) {
    response(res, 500, error.message);
  }
};

export const deleteUser = async (req, res) => {
    try {
        const { idUser } = req.params;
        const user = await userService.deleteUser(idUser);
        response(res, 200, user);
    } catch (error) {
        response(res, 500, error.message);
    }
}

export const importUserExcel = async (req, res) => {
    try {
        const { file } = req;
        if (!file) return response(res, 400, "No se recibió ningún archivo");
        const users = await userService.importUserExcel(file);
        response(res, 200, users);

    } catch (error) {
        response(res, 500, error.message);
    }
};
