import { User } from "@prisma/client";
import { IDeleteUserRepository } from "../../controllers/delete-user/protocols";
import { prisma } from "../../database/prisma";

export class PrismaDeleteUserRepository implements IDeleteUserRepository {
  async delete(id: number): Promise<User> {
    return await prisma.user.delete({
      where: {
        id: +id,
      },
    });
  }
}
