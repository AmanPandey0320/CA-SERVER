import { nanoid } from "nanoid";
import { injectable, singleton } from "tsyringe";
import { createQueryBuilder, getRepository } from "typeorm";
import { FRONTEND_URL, JWT_SECRET } from "../../../config";
import { getTemplate } from "../../../template";
import sendMail from "../../../utils/mail";
import Token from "../../entity/user/token.entity";
import { User } from "../../entity/user/user.entity";
import BaseUseCase from "../../../lib/BaseUseCase";
const jwt = require("jsonwebtoken");

@injectable()
@singleton()
class ForgotUseCase extends BaseUseCase {
  protected entity?: Token;
  protected userEntity?: User;
  constructor(entity?: Token, userEntity?: User) {
    super();
    this.entity = entity;
    this.userEntity = userEntity;
  }

  /**
   *
   * @param cred
   * @returns
   */
  private checkUser(cred: any): Promise<User | undefined> {
    return new Promise<User | undefined>(async (resolve, reject) => {
      try {
        const { email, username } = cred;
        const query = email ? "email = :email" : "username = :username";
        const dto = email ? { email } : { username };
        const user = await createQueryBuilder()
          .select("user")
          .from(User, "user")
          .where(query, dto)
          .getOne();
        if (!user?.active) {
          reject({ message: "User is disabled!" });
          return;
        }
        resolve(user);
        return;
      } catch (error) {
        reject(error);
        return;
      }
    });
  }

  protected useCaseImpl(data: any): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const { email, username } = data;
        const user: User | undefined = await this.checkUser({
          email,
          username,
        });
        if (!user) {
          reject({ message: "No such user found" });
          return;
        }
        const secret = nanoid();
        const createdAt = new Date();
        const token = new Token();
        const repo = await getRepository(Token);
        token.email = user.email;
        token.secret = secret;
        token.createdAt = `${createdAt}`;
        await repo.save(token);
        const payload = { secret, email, tid: token.id };
        const hash = await jwt.sign(payload, JWT_SECRET);
        const url = `${FRONTEND_URL}/auth/reset?t=${hash}`;
        const body = await getTemplate({ url }, "TMP02");

        await sendMail(user.email, "Password Reset", body);

        resolve(true);
        return;
      } catch (error) {
        reject(error);
        return;
      }
    });
  }
}

export default ForgotUseCase;
