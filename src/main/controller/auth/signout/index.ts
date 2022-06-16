import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { autoInjectable } from "tsyringe";
import { BaseController } from "../../../../lib/BaseController";

@autoInjectable()
class AuthSignoutController extends BaseController {
  protected name: string = "signout";
  protected method: string = "POST";

  constructor() {
    super();
  }

  protected async executeImpl(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void> {
    try {
      req.session.loggedIn = false;
      req.session.loggedUser = undefined;
      BaseController.jsonSuccessResponse(
        res,
        200,
        [{ status: true }],
        ["Signed out!"],
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

export default AuthSignoutController;
