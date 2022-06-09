import { CorsOptions } from "cors";
import dotenv from "dotenv";
dotenv.config();

// APP CONFIGS
export const APP_PORT = Number(process.env.PORT || "3000");
export const GRACEFULL_STARTUP_TIMEOUT = Number(
  process.env.GRACEFULL_STARTUP_TIMEOUT || "15000"
);
export const GRACEFULL_SHUTDOWN_TIMEOUT = Number(
  process.env.GRACEFULL_SHUTDOWN_TIMEOUT || "15000"
);
export const __DEV__ =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "dev";
export const __PROD__ =
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "prod" ||
  !__DEV__;

//DB CONFIGS
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_USER = process.env.DB_USER || "root";
export const DB_PASS = process.env.DB_PASS || "Aman@1234";
export const DB_NAME = process.env.DB_NAME || "ca_dev_sat";
export const DB_PORT = Number(process.env.DB_PORT || "3306");

//HASHING CONFIGS
export const HASH_KEY = process.env.HASH_KEY || "SUPER_SECRET";
export const HASH_VI = Number(process.env.HASH_VI || "16");
export const HASH_ALGO = process.env.HASH_ALGO || "aes-192-cbc";

//EMAIL CLIENT
export const SENDER_EMAIL_ID = process.env.OAUTH_SENDER;
export const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT;
export const OAUTH_SECRET = process.env.OAUTH_SECRET;
export const OAUTH_REFRESH_TOKEN = process.env.OAUTH_RTOKEN;
export const OAUTH_REDIRECT_URI = process.env.OAUTH_REDIRECT_URI;

// SMS CLIENT
export const SMS_API_KEY = process.env.SMS_API_KEY;

//MONGO CLIENT
export const MONGO_CONN_URI =
  process.env.MONGO_CONN || "mongodb://127.0.0.1:27017/your_db_name";

// SESSIONS
export const SESSION_SECRET = process.env.SESSION_SECRET || "super_secret";

// JWT
export const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret";

//FRONTEND
export const FRONTEND_URL = process.env.FRONTEND_URL || "localhost:3000";

//TOKEN
export const VALID_TOKEN_TIME_OUT = Number(
  process.env.VALID_TOKEN_TIME_OUT || "300000"
);

//CORS
export const CORS: CorsOptions = {
  origin: [FRONTEND_URL],
  optionsSuccessStatus: 200,
  credentials: true,
};
