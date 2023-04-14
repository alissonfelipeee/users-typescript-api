import { CreateUserController } from "./../controllers/create-user/create-user";
import { InMemoryUserRepository } from "./repositories/in-memory";

const user = {
  firstName: "John",
  lastName: "Doe",
  email: "johndoe@gmail.com",
  password: "123456",
};

const userEmptyFirstName = {
  firstName: "",
  lastName: "Doe",
  email: "johndoe@gmail.com",
  password: "123456",
}

const userWithInvalidEmail = {
  firstName: "John",
  lastName: "Doe",
  email: "johndoe",
  password: "123456",
}

describe("Create user", () => {
  it("should create a user", async () => {
    const inMemoryUserRepository = new InMemoryUserRepository();
    const createUserController = new CreateUserController(
      inMemoryUserRepository
    );

    const { body, statusCode } = await createUserController.handle({
      body: user,
    });

    expect(body).toEqual(user);
    expect(statusCode).toBe(201);
  });

  it("should not be able to create a user because firstName is empty", async () => {
    const inMemoryUserRepository = new InMemoryUserRepository();
    const createUserController = new CreateUserController(
      inMemoryUserRepository
    );

    const { body, statusCode } = await createUserController.handle({
      body: userEmptyFirstName,
    });

    expect(body).toEqual("Bad Request - Invalid firstName");
    expect(statusCode).toBe(400);
  });

  it("should not be able to create a user because email is invalid", async () => {
    const inMemoryUserRepository = new InMemoryUserRepository();
    const createUserController = new CreateUserController(
      inMemoryUserRepository
    );

    const { body, statusCode } = await createUserController.handle({
      body: userWithInvalidEmail,
    });

    expect(body).toEqual("Bad Request - Invalid email");
    expect(statusCode).toBe(400);
  });
});
