import { NextFunction, Request, Response } from "express";
import { BaseMiddleware } from "./BaseMiddleware";
import * as httpContext from "express-http-context";
import cuid from "cuid";

export class RequestIdMiddleware extends BaseMiddleware {
  public handle(req: Request, res: Response, next: NextFunction): void {
    httpContext.ns.bindEmitter(req);
    httpContext.ns.bindEmitter(res);
    let requestId = cuid();
    httpContext.set("req_id", requestId);
    req.reqId = requestId;
    next();
  }
}

export class IpAddressMiddleware extends BaseMiddleware {
  public handle(req: Request, res: Response, next: NextFunction): void {
    const IpHead: string | undefined = req.socket.remoteAddress || req.ip;
    if (IpHead) {
      const ip = IpHead.split(",")[0].replace(":ffff", "");
      httpContext.set("ip_address", ip);
      req.currIp = ip;
      next();
    } else {
      res.sendStatus(400);
    }
  }
}

export class HttpContextMiddleware extends BaseMiddleware {
    public handle(req: Request, res: Response, next: NextFunction): void {
        httpContext.middleware(req, res, next);
    }
}

