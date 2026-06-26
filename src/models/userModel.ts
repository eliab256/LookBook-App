// User model
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import type { User, UserInput } from "../types/index.js";

const getAllUsersModel = async (): Promise<User[]> => {
  const [result] = await pool.execute<User[] & RowDataPacket[]>(
    "SELECT * FROM users",
  );

  if (result.length === 0) {
    throw new Error("get all users failed");
  }

  return result;
};

const getUserByIdModel = async (id: number): Promise<User> => {
  const [result] = await pool.execute<User[] & RowDataPacket[]>(
    "SELECT * FROM users WHERE id = ?",
    [id],
  );

  if (result.length === 0) {
    throw new Error("get user by id failed");
  }

  return result[0];
};

const createUserModel = async (
  name: string,
  surname: string,
  email: string,
): Promise<void> => {
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO users (name, surname, email) VALUES (?, ?, ?)",
    [name, surname, email],
  );

  if (result.affectedRows === 0) {
    throw new Error("create user failed");
  }
};

const updateUserModel = async (id: number, user: UserInput): Promise<void> => {
  const [result] = await pool.execute<ResultSetHeader>(
    "UPDATE users SET name = ?, surname = ?, email = ? WHERE id = ?",
    [user.name, user.surname, user.email, id],
  );

  if (result.affectedRows === 0) {
    throw new Error("user update failed");
  }
};

const deleteUserModel = async (id: number): Promise<void> => {
  const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM users WHERE id = ?",
    [id],
  );

  if (result.affectedRows === 0) {
    throw new Error("User not found");
  }
};

export {
  getAllUsersModel,
  getUserByIdModel,
  createUserModel,
  updateUserModel,
  deleteUserModel,
};
