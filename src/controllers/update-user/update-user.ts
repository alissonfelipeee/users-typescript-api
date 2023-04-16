import { prisma } from "../../database/prisma";
import { User } from "../../models/user";
import { generateHash } from "../../utils/bcrypt";
import { HttpRequest, HttpResponse } from "../protocols";
import {
  IUpdateUserController,
  IUpdateUserRepository,
  UpdateUserParams,
} from "./protocols";

export class UpdateUserController implements IUpdateUserController {
  constructor(private readonly updateUserRepository: IUpdateUserRepository) {}
  async handle(httpRequest: HttpRequest<any>): Promise<HttpResponse<User>> {
    try {
      const { id } = httpRequest.params;

      if (!id) {
        return {
          statusCode: 400,
          body: "Bad Request - Missing id",
        };
      }

      if (!httpRequest.body) {
        return {
          statusCode: 400,
          body: "Bad Request - Missing body",
        };
      }

      const allowedFieldsToUpdate: (keyof UpdateUserParams)[] = [
        "firstName",
        "lastName",
        "password",
      ];
      const someFieldIsNotAllowedToUpdate = Object.keys(httpRequest.body).some(
        (key) => !allowedFieldsToUpdate.includes(key as keyof UpdateUserParams)
      );

      if (someFieldIsNotAllowedToUpdate) {
        return {
          statusCode: 400,
          body: "Bad Request - Invalid fields",
        };
      }

      if (httpRequest.body.password) {
        httpRequest.body.password = await generateHash(
          httpRequest.body.password
        );
      }

      const user = await this.updateUserRepository.updateUser(
        id,
        httpRequest.body
      );

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
