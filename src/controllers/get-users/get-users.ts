import { User } from "../../models/user";
import { excludeFields } from "../../utils/excludeFields";
import { HttpResponse, IController } from "../protocols";
import { ok, serverError } from "../utils";
import { IGetUsersRepository } from "./protocols";

export class GetUsersController implements IController {
  constructor(private readonly getUsersRepository: IGetUsersRepository) {}

  async handle(): Promise<HttpResponse<User[] | string>> {
    try {
      const users = await this.getUsersRepository.getUsers();

      const usersWithoutPassword = users.map((user) => {
        return excludeFields(user, ["password"]);
      });

      return ok<User[]>(usersWithoutPassword);
    } catch (error) {
      return serverError();
    }
  }
}
