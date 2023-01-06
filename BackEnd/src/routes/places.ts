import express, { NextFunction } from "express";
import {
  createPlace,
  deletePlace,
  getPlaceById,
  getPlacesByUserId,
  updatePlace,
} from "../controllers/places";
import { check } from "express-validator";
import { fileUpload } from "../middleware/file-upload";
import { authenticate } from "../middleware/auth";

/* ************************************************************** */

export const placesRoutes = express.Router();

placesRoutes.get("/:placeId", getPlaceById);

placesRoutes.get("/user/:userId", getPlacesByUserId);

const req = express.request;

placesRoutes.use(() => {
  authenticate(placesRoutes.arguments.request, placesRoutes.arguments.next);
});

placesRoutes.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  createPlace
);

placesRoutes.patch(
  "/:placeId",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  updatePlace
);

placesRoutes.delete("/:placeId", deletePlace);
