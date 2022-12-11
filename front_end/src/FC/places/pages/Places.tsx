import { useParams } from "react-router-dom";
import { place } from "../../../typing/interfaces";
import { PlacesList } from "../components/PlacesList";

export function Places() {
  const P1 = {
    id: 1,
    creatorId: 1,
    title: "Empire state building",
    description: "one of the most popular sky scrapers on the world",
    address: "20 W 34th st, New York, NY 10001",
    coordinate: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/800px-Empire_State_Building_%28aerial_view%29.jpg",
  };

  const P2 = {
    id: 2,
    creatorId: 1,
    title: "Azrieli Center",
    description: "one of the most popular building in israel",
    address: "Derech Menachem Begin, Tel Aviv-Yafo",
    coordinate: {
      lat: 32.0740769,
      lng: 34.7900141,
    },
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/800px-Empire_State_Building_%28aerial_view%29.jpg",
  };

  const DUMMY_PLACES: place[] = [P1, P2];
  const userId: number = parseInt(useParams().userId as string);

  return (
    <PlacesList places={DUMMY_PLACES.filter((e) => e.creatorId === userId)} />
  );
}
