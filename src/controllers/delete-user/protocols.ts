import { HttpRequest, HttpResponse } from "./../protocols";
import { User } from "../../models/user";

export interface IDeleteUserController {
  handle(httpRequest: HttpRequest<any>): Promise<HttpResponse<User>>;
}
export interface IDeleteUserRepository {
  delete(id: number): Promise<User>;
}
