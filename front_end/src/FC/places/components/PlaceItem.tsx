import React, { useContext, useState } from "react";
import { Button } from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import Modal from "../../shared/components/UIElements/Modal";
import { IPlace } from "../../../typing/interfaces";
import { Map } from "../../shared/components/UIElements/Map";

import "./PlaceItem.css";
import { AuthContext } from "../../../hooks/auth-context";
import { useHttpClient } from "../../../hooks/http-hook";
import { ErrorModal } from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { BACKEND_URL, ENDPOINT_PLACES } from "../../../util/Constants";

/* ************************************************************************************************** */

export function PlaceItem({
  place,
  onDelete,
}: {
  place: IPlace;
  onDelete: Function;
}) {
  const user = useContext(AuthContext).user!;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  /* ************************************************************************************************** */

  const isCreator = user.id === place.creatorId;
  const randomCoordinate = { lat: 32.938029, lng: 35.188625 };

  const openMapHandler = () => {
    setIsMapVisible(true);
  };

  const closeMapHandler = () => {
    setIsMapVisible(false);
  };

  const openConfirmHandler = () => {
    setIsConfirmVisible(true);
  };

  const closeConfirmHandler = () => {
    setIsConfirmVisible(false);
  };

  const confirmDeleteHandler = async () => {
    closeConfirmHandler();

    try {
      await sendRequest(ENDPOINT_PLACES + "/" + place._id, "DELETE", null, {
        Authorization: "Barer " + user.token,
      });
      onDelete(place._id);
    } catch (err) {}
  };

  /* ************************************************************************************************** */

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={isMapVisible}
        onCancel={closeMapHandler}
        header={place.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map
            center={place.coordinate ? place.coordinate : randomCoordinate}
            zoom={8}
          />
        </div>
      </Modal>
      <Modal
        show={isConfirmVisible}
        onCancel={closeConfirmHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={closeConfirmHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>Do you want to proceed and delete this!</p>
      </Modal>
      <li className="place-item">
        <Card className={"place-item__content"}>
          {isLoading ? <LoadingSpinner asOverlay /> : <></>}
          <div className="place-item__image">
            <img src={BACKEND_URL + place.image} alt={place.title + "image"} />
          </div>
          <div className="place-item__info">
            <h2>{place.title}</h2>
            <h3>{place.address}</h3>
            <p>{place.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse={true} onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {isCreator && <Button to={`/places/${place._id}`}>EDIT</Button>}
            {isCreator && (
              <Button danger={true} onClick={openConfirmHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
}
