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

    expect(user.body).toEqual({
      ...userCreated,
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

  it("should return 404 if user not found by id", async () => {
    const inMemoryUserRepository = new InMemoryUserRepository();
    const updateUserController = new UpdateUserController(
      inMemoryUserRepository
    );

    const user = await updateUserController.handle({
      params: {
        id: 2,
      },
      body: {
        lastName: "Doe Jr",
      },
    });

    expect(user.statusCode).toBe(404);
    expect(user.body).toBe("Not Found - User not found");
  });

  it("should return 500 if updateUserRepository throws", async () => {
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
