import { User } from "../../models/user";
import { IController } from "../protocols";
import { IGetUsersRepository } from "./protocols";
export class GetUsersController implements IController {
  constructor(private readonly getUsersRepository: IGetUsersRepository) {}

  async handle() {
    try {
      const users = await this.getUsersRepository.getUsers();

      const usersWithoutPassword = users.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }) as User[];

      return {
        statusCode: 200,
        body: usersWithoutPassword,
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: "Internal Server Error",
      };
    }
  }
}
