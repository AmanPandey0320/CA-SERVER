import { Request, Response, NextFunction } from "express";

export abstract class BaseMiddleware {
  constructor() {
    this.apply = this.apply.bind(this);
  }

  public apply(req: Request, res: Response, next: NextFunction): void {
    this.handle(req, res, next);
  }

  protected abstract handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): void;
}