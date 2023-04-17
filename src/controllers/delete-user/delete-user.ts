import { User } from "../../models/user";
import { HttpRequest, HttpResponse, IController } from "../protocols";
import { IDeleteUserRepository } from "./protocols";
import { IGetUserByIdRepository } from "../../services/get-user-by-id/protocols";

export class DeleteUserController implements IController {
  constructor(
    private readonly deleteUserRepository: IDeleteUserRepository,
    private readonly getUserByIdService: IGetUserByIdRepository
  ) {}

  async handle(httpRequest: HttpRequest<any>): Promise<HttpResponse<User>> {
    try {
      const { id } = httpRequest.params;

      if (!id) {
        return {
          statusCode: 400,
          body: "Missing param: id",
        };
      }

      const userExists = await this.getUserByIdService.getUserById(+id);

      if (!userExists) {
        return {
          statusCode: 404,
          body: "User not found",
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
