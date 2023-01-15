"use strict";
// const API_KEY = process.env.GOOGLE_API_KEY;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoordsForAddress = void 0;
const getCoordsForAddress = async (address) => {
    const coords = { lat: 32.93519, lng: 35.188008 };
    return coords;
    // const response = await axios.get(
    //   `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    //     address
    //   )}&key=${API_KEY}`
    // );
    // const data = response.data;
    // if (!data || data.status === "ZERO_RESULTS") {
    //   const error = new HttpError(
    //     ERROR_INVALID_LOCATION,
    //     HTTP_RESPONSE_STATUS.Unprocessable_Entity
    //   );
    //   throw error;
    // }
    // const coords = data.results[0].geometry.location;
    // return coords;
};
exports.getCoordsForAddress = getCoordsForAddress;
