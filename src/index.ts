import express from "express";
import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "./repositories";
import UserReposiroty from "./repositories/user";
import { IUserHandler } from "./handlers";
import UserHandler from "./handlers/user";

//const PORT = Number(process.env.PORT || 8080)
const app = express();
const client = new PrismaClient();
const userRepo: IUserRepository = new UserReposiroty(client);
const userHandler: IUserHandler = new UserHandler(userRepo);
app.use(express.json());
const userRouter = express.Router();

app.use("/user", userRouter);
userRouter.post("/", userHandler.registration);
app.get("/", (req, res) => {
  return res.status(200).send("Welcome to learnhub").end();
});

app.listen(process.env.PORT, () => {
  console.log(`Learnhub API is listening on port ${process.env.PORT}`);
});

// app.listen(PORT || ()=> {
//     console.log(`Learnhub API is listening on port ${PORT}`)
// })
