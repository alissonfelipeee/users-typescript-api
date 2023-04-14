import { PrismaGetUsersRepository } from "./repositories/get-users/prisma-get-users";
import { GetUsersController } from "./controllers/get-users/get-users";
import express from "express";
import { config } from "dotenv";
import { PrismaCreateUserRepository } from "./repositories/create-user/prisma-create-user";
import { CreateUserController } from "./controllers/create-user/create-user";

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
  const createUserController = new CreateUserController(
    prismaCreateUserRepository
  );

  const { body, statusCode } = await createUserController.handle({
    body: req.body,
  });

  res.status(statusCode).json(body);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
