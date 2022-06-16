// import { createQueryBuilder } from "typeorm";
// import { validateHash } from "../../../utils/hash";
// import { User } from "../../entity/user/user.entity";
// import BaseUseCase from "../BaseUseCase";

// /**
//  * 
//  */
// class EditUserUseCase extends BaseUseCase {

//   /**
//    * 
//    * @param oldPassword 
//    * @param user 
//    * @returns 
//    */
//   private validateEditUser = (oldPassword: string, user:User):Promise<boolean> => {
//     return new Promise<boolean>(async (resolve, reject) => {
//       try {
//         if (!oldPassword) {
//           reject({ message: "No oldPassword found" });
//           return;
//         }
//         if (!user) {
//           reject({ message: "No such user found" });
//           return;
//         }
//         if (!user.active) {
//           reject({ message: "User is disabled!" });
//           return;
//         }
//         const isPasswordCorrect = validateHash(oldPassword, user.password);
//         if (!isPasswordCorrect) {
//           reject({ message: "Password is incorrect!" });
//           return;
//         }
//         resolve(true);
//         return;
//       } catch (error) {
//         reject(error);
//         return;
//       }
//     });
//   };

//   /**
//    * 
//    * @param data 
//    * @returns 
//    */
//   protected useCaseImpl(data: any): Promise<any> {
//     return new Promise(async (resolve, reject) => {
//       try {
//         const { password, email, username, oldPassword, id } = data;
//         if (!id) {
//           reject({ message: "No id found" });
//           return;
//         }
//         if (!oldPassword) {
//           reject({ message: "No oldPassword found" });
//           return;
//         }

//         const user = await createQueryBuilder()
//           .select("user")
//           .from(User, "user")
//           .where("id = :id", { id })
//           .getOne();


//         if (!user) {
//           reject({ message: "No such user found" });
//           return;
//         }

//         if (password) {
//           //change password
          
//         }

//         if (email) {
//           //change email
//         }

//         if (username) {
//           //change username
//         }
//       } catch (error) {
//         reject(error);
//         return;
//       }
//     });
//   }
// }

// export default EditUserUseCase;
