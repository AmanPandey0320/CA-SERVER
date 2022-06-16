import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { autoInjectable } from "tsyringe";
import AuthResetUseCase from "../../../useCase/auth/reset";
import { BaseController } from "../../../../lib/BaseController";

@autoInjectable()
class AuthResetController extends BaseController {
  protected name: string = "reset";
  protected method: string = "POST";
  protected service?: AuthResetUseCase;

  constructor(service?: AuthResetUseCase) {
    super();
    this.service = service;
  }

  protected async executeImpl(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void> {
    try {
      const { token, password } = req.body;
      if (!(token && password)) {
        BaseController.jsonErrorResponse(
          res,
          400,
          ["Missing requires fields"],
          []
        );
        return;
      }
      const resetRes = await this.service?.use({ token, password });
      if (!resetRes) {
        BaseController.jsonErrorResponse(res, 500, ["Error occured"], []);
        return;
      }

      BaseController.jsonSuccessResponse(
        res,
        200,
        [{ status: true }],
        ["Please login again"],
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

export default AuthResetController;
