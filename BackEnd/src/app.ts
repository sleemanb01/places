import bodyParser from "body-parser";
import fs from "fs";
import express, { Request, Response, NextFunction } from "express";
import { HttpError } from "./models/http-error";
import { placesRoutes } from "./routes/places";
import { usersRoutes } from "./routes/users";
import { HTTP_RESPONSE_STATUS } from "./types/enums";
import { ERROR_UNDEFINED_ROUTE, ERROR_UNKNOWN_ERROR } from "./util/messages";
import mongoose from "mongoose";
import path from "path";

const PORT = 5000;
const URI =
  "mongodb+srv://placesAdmin:vutbcutbhqaz951@cluster0.vacgxjp.mongodb.net/places?retryWrites=true&w=majority";

const app = express();

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((_req, res, next) => {
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

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (req.file) {
    fs.unlink(req.file.path, () => {
      console.log(error);
    });
  }
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || HTTP_RESPONSE_STATUS.Internal_Server_Error);
  res.json({ message: error.message || ERROR_UNKNOWN_ERROR });
});

mongoose
  .connect(URI)
  .then(() => {
    app.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });
