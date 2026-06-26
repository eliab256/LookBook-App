import pool from "./config/db.js";
import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use("/users", userRouter);

app.listen(PORT, async () => {
  console.log(`Server avviato sulla porta ${PORT}`);
  try {
    await pool.execute("SELECT 1");
    console.log("Database connesso");
  } catch (error) {
    console.error("Errore di connessione al database:", error);
  }
});
