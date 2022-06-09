import { injectable, singleton } from "tsyringe";
import { createQueryBuilder } from "typeorm";
import { User } from "../../entity/user/user.entity";
import BaseUseCase from "../BaseUseCase";

@injectable()
@singleton()
class AuthCheckUseCase extends BaseUseCase {
  protected user?: User;
  constructor(user?: User) {
    super();
    this.user = user;
  }
  protected useCaseImpl(data: any): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const { username } = data;
        const user: User | undefined = await createQueryBuilder()
          .select("user")
          .from(User, "user")
          .where("username = :username", { username })
          .getOne();
        if (!user) {
          reject({ message: "no user such found" });
          return;
        }
        if (user.active) {
          resolve({ name: user.username, email: user.email, uid: user.id });
          return;
        } else {
          reject({ message: "User is deactivated! Please contact admin" });
          return;
        }
      } catch (error) {
        reject(error);
        return;
      }
    });
  }
}

export default AuthCheckUseCase;
