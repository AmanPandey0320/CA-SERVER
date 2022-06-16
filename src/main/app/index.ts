import express from "express";
import ServerInstance from "../server";

const app = express();

const server = new ServerInstance(app);

export default server;
