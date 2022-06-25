import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { autoInjectable } from "tsyringe";
import AuthSignInUseCase from "../../../useCase/auth/signin";
import { BaseController } from "../../../../lib/BaseController";

@autoInjectable()
class AuthSignInController extends BaseController {
  protected name: string = "signin";
  protected method: string = "POST";
  protected service?: AuthSignInUseCase;

  constructor(service?: AuthSignInUseCase) {
    super(service);
    this.service = service;
  }

  protected async executeImpl(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void> {
    try {
      const body = req.body;
      const { email, username, password } = body;
      if (!(password && (username || email))) {
        BaseController.clientError(res, ["Missing requied fields"]);
        return;
      }
      const sessionID = req.sessionID;
      const result = await this.service?.use({
        username,
        email,
        password,
        sessionID,
      });
      req.session.loggedUser = result.user;
      req.session.loggedIn = true;
      BaseController.jsonSuccessResponse(
        res,
        200,
        [result],
        ["Welcome back"],
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

export default AuthSignInController;
