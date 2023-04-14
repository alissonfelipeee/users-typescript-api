import { User } from "../../models/user";

export class InMemoryUserRepository {
  private users: User[] = [];

  async getUsers(): Promise<User[]> {
    return this.users;
  }

  async createUser(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }
}