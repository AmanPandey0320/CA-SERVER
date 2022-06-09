import { injectable, singleton } from "tsyringe";
import { createQueryBuilder } from "typeorm";
import { JWT_SECRET, VALID_TOKEN_TIME_OUT } from "../../../config";
import { createHash } from "../../../utils/hash";
import Token from "../../entity/user/token.entity";
import { User } from "../../entity/user/user.entity";
import BaseUseCase from "../BaseUseCase";
const jsonwebtoken = require("jsonwebtoken");

@injectable()
@singleton()
class AuthResetUseCase extends BaseUseCase {
  protected entity?: User;
  protected token?: Token;
  constructor(user?: User, token?: Token) {
    super();
    this.entity = user;
    this.token = token;
  }

  /**
   *
   * @param token
   * @returns
   */
  private validateToken(jwt: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const currTime = new Date();
        const { secret, tid } = await jsonwebtoken.verify(jwt, JWT_SECRET);
        const token: Token | undefined = await createQueryBuilder()
          .select("token")
          .from(Token, "token")
          .where("id = :id", { id: tid })
          .getOne();

        if (!token) {
          reject({ message: "Invalid token" });
          return;
        }
        if (token?.valid) {
          reject({ message: "Token already used" });
          return;
        }
        const createdAt = new Date(token?.createdAt);
        if (currTime.getTime() - createdAt.getTime() > VALID_TOKEN_TIME_OUT) {
          reject({ message: "Reset Timeout, Please try agaim!" });
          return;
        }
        if (token?.secret === secret) {
          await createQueryBuilder()
            .update(Token)
            .set({ valid: true })
            .where("id = :tid", { tid })
            .execute();
          resolve(token?.email);
          return;
        } else {
          resolve(false);
          return;
        }
      } catch (error) {
        reject(error);
        return;
      }
    });
  }

  /**
   *
   * @param password
   * @returns
   */
  private resetPassword(password: string, email: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const passwordHash = createHash(password);
        await createQueryBuilder()
          .update(User)
          .set({ password: passwordHash })
          .where("email = :email", { email })
          .execute();
        resolve(true);
        return;
      } catch (error) {
        reject(error);
        return;
      }
    });
  }

  /**
   *
   * @param data
   * @returns
   */
  protected useCaseImpl(data: any): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const { token, password } = data;
        const email = await this.validateToken(token);
        if (!email) {
          // invalid token
          reject({ message: "Invalid link please try again" });
          return;
        }

        const isPasswordReset = await this.resetPassword(password, email);

        if (!isPasswordReset) {
          // failed to set password
          reject({ message: "Can not reset password, Please try again later" });
          return;
        }

        resolve(true);
      } catch (error) {
        reject(error);
        return;
      }
    });
  }
}

export default AuthResetUseCase;
