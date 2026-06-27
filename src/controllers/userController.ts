import type { RequestHandler } from "express";
import type { User, UserInput } from "../types/index.js";
import {
  getAllUsersModel,
  getUserByIdModel,
  createUserModel,
  deleteUserModel,
  updateUserModel,
} from "../models/userModel.js";

const getUserController: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const user = await getUserByIdModel(id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const getAllUsersController: RequestHandler = async (req, res, next) => {
  try {
    const user = await getAllUsersModel();
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const createUserController: RequestHandler = async (req, res, next) => {
  try {
    const { name, surname, email } = req.body;
    const userCreated = await createUserModel(name, surname, email);
    res.status(201).json(userCreated);
  } catch (err) {
    next(err);
  }
};

const updateUserController: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const userInput: UserInput = req.body;
    await updateUserModel(id, userInput);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const deleteUserController: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    await deleteUserModel(userId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export {
  getUserController,
  getAllUsersController,
  createUserController,
  updateUserController,
  deleteUserController,
};
