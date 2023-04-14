import { PrismaGetUsersRepository } from './repositories/get-users/prisma-get-users';
import { GetUsersController } from './controllers/get-users/get-users';
import express from "express";
import { config } from "dotenv";

config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/users", async (req, res) => {
  const prismaGetUsersRepository = new PrismaGetUsersRepository();
  const getUsersController = new GetUsersController(prismaGetUsersRepository);

  const {body, statusCode} = await getUsersController.handle();

  res.status(statusCode).json(body);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
