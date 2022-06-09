import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { autoInjectable } from "tsyringe";
import ForgotUseCase from "../../../../lib/use-case/auth/forgot";
import { createLogger } from "../../../../utils/logger/baseLogger";
import { BaseController } from "../../BaseController";

@autoInjectable()
class ForgotPasswordController extends BaseController {
  protected name: string = "forgot-password";
  protected method: string = "POST";
  protected service?: ForgotUseCase;
  private readonly logger = createLogger("FORGOT_PASSWORD");

  constructor(service?: ForgotUseCase) {
    super(service);
    this.service = service;
  }

  protected async executeImpl(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>
  ): Promise<void> {
    try {
      const { email, username } = req.body;

      if (!(username || email)) {
        BaseController.jsonErrorResponse(
          res,
          400,
          ["Missing required fields"],
          ["Missing required fields"]
        );
        return;
      }

      await this.service?.use({ email, username });

      // loggging session out from thr server
      req.session.loggedIn = false;
      req.session.loggedUser = undefined;

      //sending response
      BaseController.jsonSuccessResponse(
        res,
        200,
        [{ status: true, mail: true }],
        ["Reset mail sent"],
        []
      );
      return;
    } catch (error: any) {
      this.logger.error({ error });
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

export default ForgotPasswordController;
