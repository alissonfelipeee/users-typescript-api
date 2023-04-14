import { IGetUsersRepository } from "../../controllers/get-users/protocols";
import { User } from "../../models/user";

export class PrismaGetUsersRepository implements IGetUsersRepository {
  async getUsers(): Promise<User[]> {
    return [
      {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        password: "123456",
      },
    ];
  }
}
