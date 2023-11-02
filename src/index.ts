import express from "express";
import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "./repositories";
import UserReposiroty from "./repositories/user";
import { IUserHandler } from "./handlers";
import UserHandler from "./handlers/user";
import JWTMiddleware from "./middleware/jwt";

//const PORT = Number(process.env.PORT || 8080)
const app = express();
const client = new PrismaClient();
const userRepo: IUserRepository = new UserReposiroty(client);
const userHandler: IUserHandler = new UserHandler(userRepo);
const jwtMiddleware = new JWTMiddleware();
app.use(express.json());
app.get("/", jwtMiddleware.auth, (req, res) => {
  console.log(res.locals);
  return res.status(200).send("Welcome to Learnhub").end();
});
const userRouter = express.Router();
app.use("/user", userRouter);
userRouter.post("/", userHandler.registration);

const authRouter = express.Router();
app.use("/auth", authRouter);
authRouter.post("/login", userHandler.login);
authRouter.get("/me", jwtMiddleware.auth, userHandler.selfcheck);
app.listen(process.env.PORT, () => {
  console.log(`Learnhub API is listening on port ${process.env.PORT}`);
});

// app.listen(PORT || ()=> {
//     console.log(`Learnhub API is listening on port ${PORT}`)
// })
// app.get("/", (req, res) => {
//   return res.status(200).send("Welcome to learnhub").end();
// });
