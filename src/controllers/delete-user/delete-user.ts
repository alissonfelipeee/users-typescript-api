import { User } from "../../models/user";
import { HttpRequest, HttpResponse, IController } from "../protocols";
import { IDeleteUserRepository } from "./protocols";
import { IGetUserByIdRepository } from "../../services/get-user-by-id/protocols";
import { badRequest, notFound, ok, serverError } from "../utils";
import { excludeFields } from "../../utils/excludeFields";

export class DeleteUserController implements IController {
  constructor(
    private readonly deleteUserRepository: IDeleteUserRepository,
    private readonly getUserByIdService: IGetUserByIdRepository
  ) {}

  async handle(
    httpRequest: HttpRequest<any>
  ): Promise<HttpResponse<User | string>> {
    try {
      const { id } = httpRequest.params;

      if (!id) {
        return badRequest("Bad Request - Missing param: id");
      }

      const userExists = await this.getUserByIdService.getUserById(+id);

      if (!userExists) {
        return notFound("Not Found - User not found");
      }

      const user = await this.deleteUserRepository.delete(+id);

      excludeFields(user, ["password"]);

      return ok<User>(user);
    } catch (error) {
      return serverError();
    }
  }
}
