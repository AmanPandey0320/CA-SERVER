import { injectable, singleton } from "tsyringe";
import { User } from "../../entity/user/user.entity";
import BaseUseCase from "../BaseUseCase";
import { JWT_SECRET } from "../../../config";
import { createQueryBuilder } from "typeorm";
const jwt = require("jsonwebtoken");

@injectable()
@singleton()
class VerifyEmailUseCase extends BaseUseCase {
  entity?: User;
  constructor(entity?: User) {
    super();
    this.entity = entity;
  }

  protected useCaseImpl(token: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const { uid } = await jwt.verify(token, JWT_SECRET);

        const user: User | undefined = await createQueryBuilder()
          .select("user")
          .from(User, "user")
          .where("id = :uid", { uid })
          .getOne();

        if (!user) {
          reject({ message: "Invalid token" });
          return;
        }

        if (user.emailVerified) {
          resolve({ message: "Email already verified", status: true });
          return;
        }

        await createQueryBuilder()
          .update(User)
          .set({ emailVerified: true, active: true })
          .where("id = :uid", { uid })
          .execute();
        resolve({ message: "Email verified", status: true });
      } catch (error: any) {
        reject(error);
        return;
      }
    });
  }
}

export default VerifyEmailUseCase;
