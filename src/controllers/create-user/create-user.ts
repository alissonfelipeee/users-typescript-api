import validator from "validator";
import { User } from "../../models/user";
import { HttpRequest, HttpResponse } from "../protocols";
import {
  CreateUserParams,
  ICreateUserController,
  ICreateUserRepository,
} from "./protocols";
import { generateHash } from "../../utils/bcrypt";
import { IEmailAlreadyExistsRepository } from "../../services/email-already-exists/protocols";

export class CreateUserController implements ICreateUserController {
  constructor(
    private readonly createUserRepository: ICreateUserRepository,
    private readonly verifyEmailAlreadyExists: IEmailAlreadyExistsRepository
  ) {}

  async handle(
    httpRequest: HttpRequest<CreateUserParams>
  ): Promise<HttpResponse<User>> {
    try {
      if (!httpRequest.body) {
        return {
          statusCode: 400,
          body: "Bad Request - Missing body",
        };
      }

      const requiredFields = ["firstName", "lastName", "email", "password"];

      for (const field of requiredFields) {
        if (!httpRequest.body.hasOwnProperty(field)) {
          return {
            statusCode: 400,
            body: `Bad Request - Missing field: ${field}`,
          };
        }
      }

      for (const field of requiredFields) {
        if (httpRequest.body[field as keyof CreateUserParams] === "") {
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

      const emailAlreadyExists =
        await this.verifyEmailAlreadyExists.emailAlreadyExists(
          httpRequest.body.email
        );

      if (emailAlreadyExists) {
        return {
          statusCode: 400,
          body: "Bad Request - Email already exists",
        };
      }

      const user = await this.createUserRepository.createUser({
        ...httpRequest.body,
        password: await generateHash(httpRequest.body.password),
      });

      const { password, ...userWithoutPassword } = user;

      return {
        statusCode: 201,
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
