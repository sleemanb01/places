import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../../hooks/http-hook";
import { IPlace } from "../../../typing/interfaces";
import { PATH_USER_PLACES } from "../../../util/Constants";
import { ErrorModal } from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { PlacesList } from "../components/PlacesList";

export function Places() {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [places, setPlaces] = useState<IPlace[]>([]);
  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await sendRequest(PATH_USER_PLACES + "/" + userId);

        setPlaces(res.places);
      } catch (err) {}
    };

    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeletedHandler = (deletedPlaceId: string) => {
    setPlaces((prevPlaces) =>
      prevPlaces.filter((p) => p._id !== deletedPlaceId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      <PlacesList
        places={places.filter((e) => e.creatorId === userId)}
        onDeletePlace={placeDeletedHandler}
      />
    </React.Fragment>
  );
}
