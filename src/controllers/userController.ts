import type { RequestHandler } from "express";
import type { User } from "../types/index.js";
import {
  getAllUsersModel,
  getUserByIdModel,
  createUserModel,
  deleteUserModel,
  updateUserModel,
} from "../models/userModel.js";

async function getUserController(req, res, next) {
  try {
    const id = Number(req.params.id);
    const user = await getUserByIdModel(id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

async function getAllUsersController(req, res, next) {
  // @audit-info cosa fare con request
  try {
    const user = await getAllUsersModel();
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

async function createUserController(req, res, next) {
  try {
    const { name, surname, email } = req.body;
    const userCreated = await createUserModel(name, surname, email);
    res.status(201).json(userCreated);
  } catch (err) {
    next(err);
  }
}

async function updateUserController(req, res, next) {
  try {
    const user: User = req.body;
    const userUpdated = await updateUserModel(user);
    res.status(200).json(userUpdated);
  } catch (err) {
    next(err);
  }
}

async function deleteUserController(req, res, next) {
  try {
    const userId = Number(req.params.id);
    const userDelated = await deleteUserModel(userId);
    res.status(204).json(userDelated);
  } catch (err) {
    next(err);
  }
}

export {
  getUserController,
  getAllUsersController,
  createUserController,
  updateUserController,
  deleteUserController,
};
