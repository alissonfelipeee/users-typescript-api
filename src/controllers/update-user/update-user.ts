import { prisma } from "../../database/prisma";
import { User } from "../../models/user";
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

      const userExists = await prisma.user.findUnique({
        where: {
          id: +id,
        }
      })

      if (!userExists) {
        return {
          statusCode: 404,
          body: "Not Found - User not found",
        };
      }

      const user = await this.updateUserRepository.updateUser(
        id,
        httpRequest.body
      );

      return {
        statusCode: 200,
        body: user,
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: "Internal Server Error",
      };
    }
  }
}
