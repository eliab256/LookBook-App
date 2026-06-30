import type { RequestHandler } from "express";
import {
  getAllUsersModel,
  getUserByIdModel,
  createUserModel,
  deleteUserModel,
  updateUserModel,
} from "../models/userModel.js";
import validateId from "../utils/validateIdUtil.js";
import validate from "../utils/validateUtil.js";
import { z } from "zod";

const userInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  surname: z.string().trim().min(1, "Surname is required"),
  email: z.string().trim().email("Invalid email format"),
});

const getUserController: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    validateId(userId);
    const user = await getUserByIdModel(userId);
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
    const { name, surname, email } = validate(userInputSchema, req.body);
    const userId = await createUserModel(name, surname, email);
    res.status(201).json({ id: userId });
  } catch (err) {
    next(err);
  }
};

const updateUserController: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    validateId(userId);
    const { name, surname, email } = validate(userInputSchema, req.body);
    await updateUserModel(userId, name, surname, email);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const deleteUserController: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    validateId(userId);
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
