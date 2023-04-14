import { User } from "../../models/user";

export class InMemoryUserRepository {
  private users: User[] = [];

  async getUsers(): Promise<User[]> {
    return this.users;
  }
}