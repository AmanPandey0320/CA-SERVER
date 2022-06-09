import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { autoInjectable } from "tsyringe";
import AuthCheckUseCase from "../../../../lib/use-case/auth/check";
import { BaseController } from "../../BaseController";

@autoInjectable()
class AuthCheckController extends BaseController {
  protected name: string = "check";
  protected method: string = "POST";
  protected service?: AuthCheckUseCase;
  constructor(service?: AuthCheckUseCase) {
    super();
    this.service = service;
  }
  protected async executeImpl(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void> {
    try {
      const username = req.session.loggedUser;
      const isLoggedIn = req.session.loggedIn;
      if (isLoggedIn === false) {
        BaseController.jsonSuccessResponse(
          res,
          401,
          ["you current session is not logged in"],
          []
        );
        return;
      }

      if (!username) {
        BaseController.jsonErrorResponse(res, 400, ["Please login again!"], []);
        return;
      }

      const user = await this.service?.use({ username });

      BaseController.jsonSuccessResponse(
        res,
        200,
        [{ status: true, ...user }],
        ["Welcome!"],
        []
      );
      return;
    } catch (error: any) {
      BaseController.jsonErrorResponse(
        res,
        500,
        ["Error occured"],
        ["Some Error", error.message]
      );
      return;
    }
  }
}

export default AuthCheckController;
