import { UpdateUserParams } from "../../controllers/update-user/protocols";
import { User } from "../../models/user";

export class InMemoryUserRepository {
  private users: User[] = [];

  async getUsers(): Promise<User[]> {
    return this.users;
  }


  async createUser(user: User): Promise<User> {
    const newUser = { ...user, id: this.users.length + 1 };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: number, params: UpdateUserParams): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    const user = this.users[userIndex];
    const updatedUser = { ...user, ...params };
    this.users[userIndex] = updatedUser;
    return updatedUser;
  }
}
