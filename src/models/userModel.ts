// User model
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db.js";
import type { User } from "../types/index.js";

async function getAllUsersModel(): Promise<User[]> {
  const [result] = await pool.execute<User[] & RowDataPacket[]>(
    `SELECT * FROM users`,
  );

  if (result.length === 0) {
    throw new Error("get all users failed");
  } else return result;
}

async function getUserByIdModel(id: number): Promise<User> {
  const [result] = await pool.execute<User[] & RowDataPacket[]>(
    `SELECT * FROM users WHERE id=?`,
    [id],
  );

  if (result.length === 0) {
    throw new Error("get user by id failed");
  } else return result[0];
}

async function createUserModel(
  name: string,
  surname: string,
  email: string,
): Promise<void> {
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO users (name, surname, email) VALUES (?, ?, ?)",
    [name, surname, email],
  );

  if (result.affectedRows === 0) throw new Error("create user failed");
}

async function updateUserModel(user: User): Promise<void> {
  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE users SET name = ?, surname = ?, email = ? WHERE id = ?`,
    [user.name, user.surname, user.email, user.id],
  );
  if (result.affectedRows === 0) throw new Error("user update failed");
}

async function deleteUserModel(id: number): Promise<void> {
  const [result] = await pool.execute<ResultSetHeader>(
    `DELETE FROM users WHERE id = ?`,
    [id],
  );
  if (result.affectedRows === 0) throw new Error("User not found");
}

export {
  getAllUsersModel,
  getUserByIdModel,
  createUserModel,
  updateUserModel,
  deleteUserModel,
};
