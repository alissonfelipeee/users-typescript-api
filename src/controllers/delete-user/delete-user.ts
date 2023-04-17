import { User } from "../../models/user";
import { HttpRequest, HttpResponse } from "../protocols";
import { IDeleteUserController, IDeleteUserRepository } from "./protocols";

export class DeleteUserController implements IDeleteUserController {
  constructor(private readonly deleteUserRepository: IDeleteUserRepository) {}

  async handle(httpRequest: HttpRequest<any>): Promise<HttpResponse<User>> {
    try {
      const { id } = httpRequest.params;

      if (!id) {
        return {
          statusCode: 400,
          body: "Missing param: id",
        };
      }

      const user = await this.deleteUserRepository.delete(+id);

      const { password, ...userWithoutPassword } = user;

      return {
        statusCode: 200,
        body: userWithoutPassword as User,
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: "Internal Server Error",
      };
    }
  }
}
