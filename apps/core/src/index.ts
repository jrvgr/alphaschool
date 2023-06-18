import express, { Router } from "express";
import cors from "cors";
import session from "express-session";
import bodyParser from "body-parser";
import RedisStore from "connect-redis";
import { createClient } from "redis";
import { checkAuthentication, refreshTokens } from "./routes/authentication";

import authenticationRouter from "./routes/authentication";
import userRouter from "./routes/user";
import scheduleRouter from "./routes/schedule";
import organisationRouter from "./routes/organistations";
import errorHandler from "./lib/errorHandler";

const app = express();
const port = process.env.PORT;

export class ExpressError extends Error {
  status: number;
  constructor(message: string, status: number = 500) {
    super(message);
    this.status = status;
  }
}

declare module "express-session" {
  interface SessionData {
    authenticated: boolean;
    token: string;
    refreshToken: string;
    expiresAt: number;
    organisationId: string;
    apiUrl: string;
    userId: string;
  }
}

let redisClient = createClient();
redisClient.connect().catch(console.error);

let redisStore = new RedisStore({
  client: redisClient,
  prefix: "alphaSchool:",
  serializer: {
    stringify: (obj) => JSON.stringify(obj),
    parse: (str) => JSON.parse(str),
  },
});

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    store: redisStore,
    name: "login-session",
    resave: true,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7 * 1000,
      path: "/",
      httpOnly: true,
    },
  })
);

//middleware

app.use(bodyParser.json());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(checkAuthentication);

app.use(refreshTokens);

//routes

app.use("/auth", authenticationRouter);
app.use("/user", userRouter);
app.use("/schedule", scheduleRouter);
app.use("/organisations", organisationRouter);


app.get("/logged-in", (req, res) => {
  console.log(req.session)
  if (!req.session?.apiUrl) {
    res.status(401).send("not logged in");
    return;
  }
  res.status(200).send({ loggedIn: true });
});
//listener

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
