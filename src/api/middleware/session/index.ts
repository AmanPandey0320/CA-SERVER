import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import useSession from "../../../utils/sessions";
import { BaseMiddleware } from "../BaseMiddleware";

class SessionMiddleWare extends BaseMiddleware {
  protected handle(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): void {
    useSession(req, res, next);
  }
}

export default SessionMiddleWare;
