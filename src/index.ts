import express from "express";
import { PrismaClient } from "@prisma/client";
import { IContentRepository, IUserRepository } from "./repositories";
import UserReposiroty from "./repositories/user";
import { IContentHandler, IUserHandler } from "./handlers";
import UserHandler from "./handlers/user";
import JWTMiddleware from "./middleware/jwt";
import ContentRepository from "./repositories/content";
import ContentHandler from "./handlers/content";

//const PORT = Number(process.env.PORT || 8080)
const app = express();
const client = new PrismaClient();
const userRepo: IUserRepository = new UserReposiroty(client);
const userHandler: IUserHandler = new UserHandler(userRepo);
const contentRepo: IContentRepository = new ContentRepository(client);
const contentHandler: IContentHandler = new ContentHandler(contentRepo);
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

const contentRouter = express.Router();
app.use("/content", contentRouter);
contentRouter.post("/", jwtMiddleware.auth, contentHandler.create);
contentRouter.get("/", contentHandler.getAll);
contentRouter.get("/:id", contentHandler.getContentById);
contentRouter.patch("/:id", jwtMiddleware.auth, contentHandler.updateById);
contentRouter.delete("/:id", jwtMiddleware.auth, contentHandler.deleteById);

app.listen(process.env.PORT, () => {
  console.log(`Learnhub API is listening on port ${process.env.PORT}`);
});

// app.listen(PORT || ()=> {
//     console.log(`Learnhub API is listening on port ${PORT}`)
// })
// app.get("/", (req, res) => {
//   return res.status(200).send("Welcome to learnhub").end();
// });
