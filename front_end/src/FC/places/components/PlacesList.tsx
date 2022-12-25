import Card from "../../shared/components/UIElements/Card";
import { IPlace } from "../../../typing/interfaces";
import { PlaceItem } from "./PlaceItem";

import "./PlacesList.css";

import { Button } from "../../shared/components/FormElements/Button";

export function PlacesList({ places }: { places: IPlace[] }) {
  if (places.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found. Maybe create one?</h2>
          <Button to="/places/new">SHARE PLACE</Button>
        </Card>
      </div>
    );
  }
  return (
    <ul className="place-list">
      {places.map((curr) => (
        <PlaceItem key={curr.id.toString()} place={curr} />
      ))}
    </ul>
  );
}
