import { Router } from "express";
import { container } from "tsyringe";
import { User } from "../../../lib/entity/user/user.entity";
import AuthCheckController from "../../controller/auth/check";
import ForgotPasswordController from "../../controller/auth/forgot";
import AuthResetController from "../../controller/auth/reset";
import AuthSignInController from "../../controller/auth/signin";
import AuthSignoutController from "../../controller/auth/signout";
import AuthSignUpController from "../../controller/auth/signup";
import VerifyEmail from "../../controller/auth/verifyEmail";

const router = Router();

router.get("/", (req, res) => {
  const ip = req.currIp;
  console.log(User);
  res.send(ip);
});

const signUpController = container.resolve(AuthSignUpController);
const verifyEmailController = container.resolve(VerifyEmail);
const signInController = container.resolve(AuthSignInController);
const forgotController = container.resolve(ForgotPasswordController);
const resetControler = container.resolve(AuthResetController);
const checkController = container.resolve(AuthCheckController);
const signoutController = container.resolve(AuthSignoutController);

router.post("/signup", signUpController.execute);
router.post("/verify-email", verifyEmailController.execute);
router.post("/signin", signInController.execute);
router.post("/forgot-password", forgotController.execute);
router.post("/reset", resetControler.execute);
router.get("/check", checkController.execute);
router.get("/signout", signoutController.execute);

module.exports = router;
