import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { autoInjectable } from "tsyringe";
import VerifyEmailUseCase from "../../../../lib/use-case/auth/verify-email";
import { BaseController } from "../../BaseController";

@autoInjectable()
class VerifyEmail extends BaseController {
  protected name: string = "verify-email";
  protected method: string = "POST";
  constructor(service: VerifyEmailUseCase) {
    super(service);
  }

  protected async executeImpl(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void> {
    try {
      const { token } = req.body;
      const verifyEmailRes = await this.service?.use(token);
      if (!verifyEmailRes) {
        BaseController.jsonErrorResponse(
          res,
          400,
          ["Some error"],
          ["No token found"]
        );
        return;
      }
      BaseController.jsonSuccessResponse(
        res,
        200,
        [{ verified: true }],
        [verifyEmailRes.message]
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

export default VerifyEmail;
