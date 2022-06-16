import http, { IncomingMessage, OutgoingMessage } from "http";
import express, { Express } from "express";
import initRouter from "./router";
import { APP_PORT, CORS } from "../config";
import { Socket } from "net";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
  HttpContextMiddleware,
  IpAddressMiddleware,
  RequestIdMiddleware,
} from "./middleware/index";
// import useSession from "../utils/sessions";
import { BaseMiddleware } from "./middleware/BaseMiddleware";
import { createLogger, Logger } from "../utils/logger/baseLogger";
import SessionMiddleWare from "./middleware/session";

class ServerInstance {
  private _context: string = "SERVER-CLASS";
  private logger: Logger;
  private server: http.Server;
  private app: Express;
  private catchIpMiddleware: BaseMiddleware;
  private httpContextMiddleware: BaseMiddleware;
  private requestIdMiddleware: BaseMiddleware;
  private sessionMiddleware: BaseMiddleware;

  private mapConnection: Map<Socket, number>;
  private sentConnectionClosed: WeakMap<Socket, boolean>;
  private activeRequestsCount: number;

  private isClosing: boolean;

  constructor(app: Express) {
    this.app = app;
    this.server = http.createServer(app);
    this.isClosing = false;
    this.logger = createLogger(this._context);

    this.mapConnection = new Map();
    this.sentConnectionClosed = new WeakMap();
    this.activeRequestsCount = 0;

    // middlewares
    this.catchIpMiddleware = new IpAddressMiddleware();
    this.httpContextMiddleware = new HttpContextMiddleware();
    this.requestIdMiddleware = new RequestIdMiddleware();
    this.sessionMiddleware = new SessionMiddleWare();
    this.server.on("request", this.catchRequest.bind(this));
  }

  /**
   *
   * @param req
   * @param res
   */
  catchRequest(req: IncomingMessage, res: OutgoingMessage): void {
    if (this.server.listening === false) {
      res.setHeader("connection", "close");
      return;
    }
    this.activeRequestsCount++;

    const currCount = this.mapConnection.get(req.socket) || 0;
    this.mapConnection.set(req.socket, currCount + 1);

    if (this.isClosing && !res.headersSent) {
      res.setHeader("connection", "close");
      this.sentConnectionClosed.set(req.socket, false);
    }
    res.on("finish", () => this.releaseRequest(req.socket));
  }

  /**
   *
   * @param socket
   */
  releaseRequest(socket: Socket): void {
    this.activeRequestsCount--;

    const socketPendingRequests = (this.mapConnection.get(socket) || 1) - 1;
    const hasSuggestedClosingConnection =
      this.sentConnectionClosed.get(socket) || false;

    this.mapConnection.set(socket, socketPendingRequests);
    if (
      this.isClosing &&
      socketPendingRequests === 0 &&
      hasSuggestedClosingConnection
    ) {
      socket.end();
    }
  }

  /**
   *
   * @param force
   * @returns
   */
  endAllConnections(force: boolean): void {
    if (this.activeRequestsCount === 0) {
      return;
    }
    this.mapConnection.forEach((cnt, socket) => {
      if (force || cnt === 0) {
        socket.end();
      }
    });
  }

  attachMiddleWares() {
    this.app.use(cors(CORS));
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(this.sessionMiddleware.apply);
    this.app.use(this.httpContextMiddleware.apply);
    this.app.use(this.requestIdMiddleware.apply);
    this.app.use(this.catchIpMiddleware.apply);
  }

  /**
   * @description starts server
   * @returns
   */
  start(): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        if (this.server.listening) {
          reject(false);
          return;
        }
        this.server.once("error", (err: any) => {
          console.log(err);
          reject(false);
          return;
        });

        this.attachMiddleWares();
        const isRouteLoaded = await initRouter(this.app);

        this.server.on("release", () => {
          this.server.listen(APP_PORT, () => {
            this.logger.info(`server listing @ ${APP_PORT}`);
            resolve(true);
          });
        });

        if (isRouteLoaded) {
          this.server.emit("release");
        }
        return;
      } catch (error) {
        reject(false);
      }
    });
  }
  /**
   * @description closes server
   * @returns
   */
  async close(): Promise<void> {
    if (this.server.listening === false) {
      this.logger.warn("server has already stopped");
      return;
    }
    if (this.isClosing) {
      this.logger.warn("server shut down already started");
      return;
    }
    this.logger.info("stopping server");
    this.isClosing = true;
    this.server.close((err) => {
      this.isClosing = false;
      if (err) {
        this.endAllConnections(false);
        return;
      } else {
        return;
      }
    });
  }
}

export default ServerInstance;
