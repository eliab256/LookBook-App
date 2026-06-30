// User model
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import type { User } from "../types/index.js";
import AppError from "../errors/AppErrors.js";

const getAllUsersModel = async (): Promise<User[]> => {
  const [result] = await pool.execute<User[] & RowDataPacket[]>(
    "SELECT * FROM users",
  );

  return result;
};

const getUserByIdModel = async (id: number): Promise<User> => {
  const [result] = await pool.execute<User[] & RowDataPacket[]>(
    "SELECT * FROM users WHERE id = ?",
    [id],
  );

  if (result.length === 0) {
    throw new AppError(404, "User not found", "USER_NOT_FOUND");
  }

  return result[0];
};

const createUserModel = async (
  name: string,
  surname: string,
  email: string,
): Promise<number> => {
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO users (name, surname, email) VALUES (?, ?, ?)",
    [name, surname, email],
  );

  if (result.affectedRows === 0) {
    throw new AppError(400, "Create user failed", "USER_CREATE_FAILED");
  }

  return result.insertId;
};

const updateUserModel = async (
  id: number,
  name: string,
  surname: string,
  email: string,
): Promise<void> => {
  const [result] = await pool.execute<ResultSetHeader>(
    "UPDATE users SET name = ?, surname = ?, email = ? WHERE id = ?",
    [name, surname, email, id],
  );

  if (result.affectedRows === 0) {
    throw new AppError(404, "User not found", "USER_NOT_FOUND");
  }
};

const deleteUserModel = async (id: number): Promise<void> => {
  const [orders] = await pool.execute<RowDataPacket[]>(
    "SELECT 1 FROM swap_order_users WHERE user_id = ? LIMIT 1",
    [id],
  );

  if (orders.length > 0) {
    throw new AppError(
      409,
      "User is part of a swap order and cannot be deleted",
      "USER_IN_SWAP_ORDER",
    );
  }

  const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM users WHERE id = ?",
    [id],
  );

  if (result.affectedRows === 0) {
    throw new AppError(404, "User not found", "USER_NOT_FOUND");
  }
};

export {
  getAllUsersModel,
  getUserByIdModel,
  createUserModel,
  updateUserModel,
  deleteUserModel,
};
