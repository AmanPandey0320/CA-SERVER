import { connection } from "mongoose";
import { SESSION_SECRET } from "../config";

const sessions = require("express-session");
const connectMongo = require("connect-mongo");

const MongoStore = connectMongo(sessions);

const sessionStore = new MongoStore({
  mongooseConnection: connection,
  collection: "ca_user_sessions",
});
/**
 * @middleware
 */
const useSession = sessions({
  name: "ca_app_session",
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  },
});

export default useSession;
