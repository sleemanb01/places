import bodyParser from "body-parser";
import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import { HttpError } from "./models/http-error";
import { placesRoutes } from "./routes/places";
import { usersRoutes } from "./routes/users";
import { HTTP_RESPONSE_STATUS } from "./types/enums";
import { ERROR_UNDEFINED_ROUTE, ERROR_UNKNOWN_ERROR } from "./util/messages";
import mongoose from "mongoose";

const PORT = 5000;
const URI =
  "mongodb+srv://placesAdmin:vutbcutbhqaz951@cluster0.vacgxjp.mongodb.net/places?retryWrites=true&w=majority";

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((_req, _res, _next) => {
  const error = new HttpError(
    ERROR_UNDEFINED_ROUTE,
    HTTP_RESPONSE_STATUS.Not_Found
  );
  throw error;
});

app.use(
  (error: HttpError, _req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(error);
    }
    res.status(error.code || HTTP_RESPONSE_STATUS.Internal_Server_Error);
    res.json({ message: error.message || ERROR_UNKNOWN_ERROR });
  }
);

mongoose
  .connect(URI)
  .then(() => {
    app.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });
