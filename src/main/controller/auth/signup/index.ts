import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { autoInjectable } from "tsyringe";
import SignUpUseCase from "../../../useCase/auth/signup";
import { BaseController } from "../../../../lib/BaseController";

/**
 *
 */

@autoInjectable()
class AuthSignUpController extends BaseController {
  protected method: string = "POST";
  protected name: string = "signup";
  constructor(service?: SignUpUseCase) {
    super(service);
  }
  protected async executeImpl(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void> {
    try {
      const ip = req.currIp;
      const body = req.body;
      const { email, username, password } = body;

      // check for valid data
      if (!email) {
        BaseController.clientError(res, ["Email id is required"]);
        return;
      }

      if (!password) {
        BaseController.clientError(res, ["Password is required"]);
        return;
      }

      // call sign up service
      const result = await this.service?.use({ email, username, password });
      BaseController.jsonSuccessResponse(
        res,
        200,
        [{ ip }, result],
        ["response"]
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

export default AuthSignUpController;
