import { PrismaDeleteUserRepository } from "./repositories/delete-user/prisma-delete-user";
import { PrismaGetUsersRepository } from "./repositories/get-users/prisma-get-users";
import { GetUsersController } from "./controllers/get-users/get-users";
import express from "express";
import { config } from "dotenv";
import { PrismaCreateUserRepository } from "./repositories/create-user/prisma-create-user";
import { CreateUserController } from "./controllers/create-user/create-user";
import { PrismaUpdateUserRepository } from "./repositories/update-user/prisma-update-user";
import { UpdateUserController } from "./controllers/update-user/update-user";
import { PrismaEmailAlreadyExistsRepository } from "./repositories/email-already-exists/prisma-email-already-exists";
import { DeleteUserController } from "./controllers/delete-user/delete-user";

config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get("/users", async (req, res) => {
  const prismaGetUsersRepository = new PrismaGetUsersRepository();
  const getUsersController = new GetUsersController(prismaGetUsersRepository);

  const { body, statusCode } = await getUsersController.handle();

  res.status(statusCode).json(body);
});

app.post("/users", async (req, res) => {
  const prismaCreateUserRepository = new PrismaCreateUserRepository();
  const prismaEmailAlreadyExistsRepository =
    new PrismaEmailAlreadyExistsRepository();
  const createUserController = new CreateUserController(
    prismaCreateUserRepository,
    prismaEmailAlreadyExistsRepository
  );

  const { body, statusCode } = await createUserController.handle({
    body: req.body,
  });

  res.status(statusCode).json(body);
});

app.patch("/users/:id", async (req, res) => {
  const prismaUpdateUserRepository = new PrismaUpdateUserRepository();
  const updateUserController = new UpdateUserController(
    prismaUpdateUserRepository
  );

  const { body, statusCode } = await updateUserController.handle({
    body: req.body,
    params: req.params,
  });

  res.status(statusCode).json(body);
});

app.delete("/users/:id", async (req, res) => {
  const prismaDeleteUserRepository = new PrismaDeleteUserRepository();
  const deleteUserController = new DeleteUserController(
    prismaDeleteUserRepository
  );

  const { body, statusCode } = await deleteUserController.handle({
    params: req.params,
  });

  res.status(statusCode).json(body);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
