import { injectable, singleton } from "tsyringe";
import { getRepository } from "typeorm";
import { createHash } from "../../../utils/hash";
import { User } from "../../entity/user/user.entity";
import UserI from "../../entity/user/user.interface";
import BaseUseCase from "../../../lib/BaseUseCase";
import jwt from "jsonwebtoken";
import { FRONTEND_URL, JWT_SECRET } from "../../../config";
import { getTemplate } from "../../../template";
import sendMail from "../../../utils/mail";

@injectable()
@singleton()
class SignUpUseCase extends BaseUseCase {
  entity?: User;
  constructor(entity?: User) {
    super();
    this.entity = entity;
  }

  private sendVerificationMail(uid: number, email: string): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const token = await jwt.sign({ uid }, JWT_SECRET);
        const url = `${FRONTEND_URL}/auth/verify?t=${token}`;
        const body = await getTemplate({ url }, "TMP01");
        await sendMail(email, "Classroom APP account verification", body);
        resolve(true);
      } catch (error) {
        reject(error);
        return;
      }
    });
  }

  protected useCaseImpl(data: UserI): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        let user = new User();
        user = data;

        //create password has
        const passwordHash = createHash(data.password);
        user.password = passwordHash;

        const repo = await getRepository(User);
        const result = await repo.save(user);
        const sendmailResult = await this.sendVerificationMail(
          user.id,
          user.email
        );

        //mail not sent
        if (!sendmailResult) {
          reject({ message: "Unable to send email" });
          return;
        }
        
        resolve(result);
        return;
      } catch (error) {
        reject(error);
        return;
      }
    });
  }
}

export default SignUpUseCase;
