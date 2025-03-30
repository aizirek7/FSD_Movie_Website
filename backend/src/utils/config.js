import dotenv from "dotenv";

dotenv.config();

export const HTTP_PORT = 3001;

export const { PG_URI } = process.env;
