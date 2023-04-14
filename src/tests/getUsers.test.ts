import { GetUsersController } from "../controllers/get-users/get-users";
import { InMemoryUserRepository } from "./repositories/in-memory";

describe("Get Users", () => {
  it("should return a empty list of users", async () => {
    const inMemoryUserRepository = new InMemoryUserRepository();
    const getUsersController = new GetUsersController(inMemoryUserRepository);

    const { body, statusCode } = await getUsersController.handle();

    expect(body).toEqual([]);
    expect(statusCode).toBe(200);
  });
});
