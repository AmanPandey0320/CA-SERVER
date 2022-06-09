import { injectable, singleton } from "tsyringe";
import { createQueryBuilder, getRepository } from "typeorm";
import { validateHash } from "../../../utils/hash";
import LoginAttempt from "../../entity/user/loginAttempts.entity";
import { User } from "../../entity/user/user.entity";
import BaseUseCase from "../BaseUseCase";

@injectable()
@singleton()
class AuthSignInUseCase extends BaseUseCase {
  entity?: User;
  loginAttempt?: LoginAttempt;
  constructor(entity?: User, loginEntity?: LoginAttempt) {
    super();
    this.entity = entity;
    this.loginAttempt = loginEntity;
  }

  /**
   *
   */
  private createLoginViaUserName(
    username: string,
    sessionID: string
  ): Promise<LoginAttempt> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const loginAttempt = new LoginAttempt();
        const repo = await getRepository(LoginAttempt);

        loginAttempt.username = username;
        loginAttempt.sessionID = sessionID;

        await repo.save(loginAttempt);

        resolve(loginAttempt.id);
        return;
      } catch (error) {
        reject(error);
        return;
      }
    });
  }
  /**
   *
   */
  private createLoginViaEmail(
    email: string,
    sessionID: string
  ): Promise<LoginAttempt> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const loginAttempt = new LoginAttempt();
        const repo = await getRepository(LoginAttempt);

        loginAttempt.email = email;
        loginAttempt.sessionID = sessionID;

        await repo.save(loginAttempt);

        resolve(loginAttempt.id);
        return;
      } catch (error) {
        reject(error);
        return;
      }
    });
  }

  /**
   *
   * @param id
   * @returns
   */
  private markValidLogin(
    id: number,
    username: string,
    email: string
  ): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        await createQueryBuilder()
          .update(LoginAttempt)
          .set({ valid: true, username, email })
          .where("id = :id", { id })
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
   * @param email
   * @param password
   * @returns
   */
  private signInWithEmail(email: string, password: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const user: User | undefined = await createQueryBuilder()
          .select("user")
          .from(User, "user")
          .where("email = :email", { email })
          .getOne();
        if (!user) {
          reject({ message: "No user with this email found" });
          return;
        }
        if (!user.emailVerified) {
          reject({ message: "Email not verified" });
          return;
        }
        const isPasswordValid = validateHash(user.password, password);

        //incorrect password
        if (!isPasswordValid) {
          reject({ message: "Wrong Password" });
          return;
        }

        // activate user if deactive
        if (!user.active) {
          await createQueryBuilder()
            .update(User)
            .set({ active: true })
            .where("id = :id", { id: user.id })
            .execute();
        }

        resolve({ message: `Welcome ${user.username}`, user: user.username });
        return;
      } catch (error) {
        reject(error);
        return;
      }
    });
  }

  /**
   *
   * @param email
   * @param password
   * @returns
   */
  private signInWithUserName(username: string, password: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const user: User | undefined = await createQueryBuilder()
          .select("user")
          .from(User, "user")
          .where("username = :username", { username })
          .getOne();

        // no user found
        if (!user) {
          reject({ message: "No user with this username found" });
          return;
        }

        // email not verified
        if (!user.emailVerified) {
          reject({ message: "Email not verified" });
          return;
        }
        const isPasswordValid = validateHash(user.password, password);

        //incorrect password
        if (!isPasswordValid) {
          reject({ message: "Wrong Password" });
          return;
        }

        // activate user if deactive
        if (!user.active) {
          await createQueryBuilder()
            .update(User)
            .set({ active: true })
            .where("id = :id", { id: user.id })
            .execute();
        }
        resolve({ message: `Welcome ${user.username}`, user: user.username });
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
    return new Promise(async (resolve, reject) => {
      try {
        const { email, password, username, sessionID } = data;
        let loginId: any;
        if (email && password) {
          //sign in using email & password
          loginId = await this.createLoginViaEmail(email, sessionID);
          const result = await this.signInWithEmail(email, password);
          await this.markValidLogin(loginId, username, email);
          resolve(result);
          return;
        } else if (username && password) {
          //sign in using user name and password
          loginId = await this.createLoginViaUserName(username, sessionID);
          const result = await this.signInWithUserName(username, password);
          await this.markValidLogin(loginId, username, email);
          resolve(result);
          return;
        } else {
          reject({ message: "Missing required fields" });
          return;
        }
      } catch (error) {
        reject(error);
        return;
      }
    });
  }
}

export default AuthSignInUseCase;
