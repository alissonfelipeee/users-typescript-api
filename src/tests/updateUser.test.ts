import { User } from "../models/user";
import { UpdateUserController } from "./../controllers/update-user/update-user";
import { InMemoryUserRepository } from "./repositories/in-memory";

const userExample = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "johndoe@gmail.com",
  password: "123456",
};

describe("Update User", () => {
  it("should update user", async () => {
    const inMemoryUserRepository = new InMemoryUserRepository();
    const updateUserController = new UpdateUserController(
      inMemoryUserRepository
    );

    const userCreated = await inMemoryUserRepository.createUser(userExample);

    const user = await updateUserController.handle({
      params: {
        id: userCreated.id,
      },
      body: {
        lastName: "Doe Jr",
      },
    });

    const { password, ...userWithoutPassword } = user.body as User;

    expect(user.body).toEqual({
      ...userWithoutPassword,
      lastName: "Doe Jr",
    });
  });

  it("should update user and update password", async () => {
    const inMemoryUserRepository = new InMemoryUserRepository();
    const updateUserController = new UpdateUserController(
      inMemoryUserRepository
    );

    const userCreated = await inMemoryUserRepository.createUser(userExample);

    const user = await updateUserController.handle({
      params: {
        id: userCreated.id,
      },
      body: {
        lastName: "Doe Jr",
        password: "1234567",
      },
    });

    const { password, ...userWithoutPassword } = user.body as User;

    expect(user.body).toEqual({
      ...userWithoutPassword,
      lastName: "Doe Jr",

    });
  });

  it("should return 400 if id is not provided", async () => {
    const inMemoryUserRepository = new InMemoryUserRepository();
    const updateUserController = new UpdateUserController(
      inMemoryUserRepository
    );

    const user = await updateUserController.handle({
      params: {},
      body: {
        lastName: "Doe Jr",
      },
    });

    expect(user.statusCode).toBe(400);
    expect(user.body).toBe("Bad Request - Missing id");
  });

  it("should return 400 if body is not provided", async () => {
    const inMemoryUserRepository = new InMemoryUserRepository();
    const updateUserController = new UpdateUserController(
      inMemoryUserRepository
    );

    const user = await updateUserController.handle({
      params: {
        id: 1,
      },
    });

    expect(user.statusCode).toBe(400);
    expect(user.body).toBe("Bad Request - Missing body");
  });

  it("should return 400 if there are invalid fields", async () => {
    const inMemoryUserRepository = new InMemoryUserRepository();
    const updateUserController = new UpdateUserController(
      inMemoryUserRepository
    );

    const user = await updateUserController.handle({
      params: {
        id: 1,
      },
      body: {
        email: "johndoe2@gmail.com",
      },
    });

    expect(user.statusCode).toBe(400);
    expect(user.body).toBe("Bad Request - Invalid fields");
  });

  it("should return 500 if something goes wrong", async () => {
    const inMemoryUserRepository = new InMemoryUserRepository();
    const updateUserController = new UpdateUserController(
      inMemoryUserRepository
    );

    jest
      .spyOn(inMemoryUserRepository, "updateUser")
      .mockImplementationOnce(() => {
        throw new Error();
      });

    const user = await updateUserController.handle({
      params: {
        id: 1,
      },
      body: {
        lastName: "Doe Jr",
      },
    });

    expect(user.statusCode).toBe(500);
    expect(user.body).toBe("Internal Server Error");
  });
});
