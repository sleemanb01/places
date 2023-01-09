import axios from "axios";
import { HttpError } from "../models/http-error";
import { HTTP_RESPONSE_STATUS } from "../types/enums";
import { ERROR_INVALID_LOCATION } from "./messages";

const API_KEY = process.env.GOOGLE_API_KEY;

export const getCoordsForAddress = async (address: string) => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );
  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      ERROR_INVALID_LOCATION,
      HTTP_RESPONSE_STATUS.Unprocessable_Entity
    );
    throw error;
  }

  const coords = data.results[0].geometry.location;

  return coords;
};
