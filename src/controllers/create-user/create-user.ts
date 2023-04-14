import validator from "validator";
import { User } from "../../models/user";
import { HttpRequest, HttpResponse } from "../protocols";
import {
  CreateUserParams,
  ICreateUserController,
  ICreateUserRepository,
} from "./protocols";

export class CreateUserController implements ICreateUserController {
  constructor(private readonly createUserRepository: ICreateUserRepository) {}
  async handle(
    httpRequest: HttpRequest<CreateUserParams>
  ): Promise<HttpResponse<User>> {
    try {
      const requiredFields: string[] = [
        "firstName",
        "lastName",
        "email",
        "password",
      ];

      for (const field of requiredFields) {
        if (!httpRequest?.body?.hasOwnProperty(field)) {
          return {
            statusCode: 400,
            body: `Bad Request - Missing field: ${field}`,
          };
        }
      }

      for (const field of requiredFields) {
        if (httpRequest?.body?.[field as keyof CreateUserParams] === "" ) {
          return {
            statusCode: 400,
            body: `Bad Request - Invalid ${field}`,
          };
        }
      }

      const emailIsValid = validator.isEmail(httpRequest.body!.email);

      if (!emailIsValid) {
        return {
          statusCode: 400,
          body: "Bad Request - Invalid email",
        };
      }

      const user = await this.createUserRepository.createUser(httpRequest.body!);

      return {
        statusCode: 201,
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
