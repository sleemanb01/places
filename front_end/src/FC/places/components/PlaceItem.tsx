import React, { useContext, useState } from "react";
import { Button } from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import Modal from "../../shared/components/UIElements/Modal";
import { place } from "../../../typing/interfaces";
import { Map } from "../../shared/components/UIElements/Map";

import "./PlaceItem.css";
import { AuthContext } from "../../../hooks/auth-context";

export function PlaceItem({ place }: { place: place }) {
  const ctx = useContext(AuthContext);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

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

  const confirmDeleteHandler = () => {
    closeConfirmHandler();
    console.log("DELETING...");
  };

  const isCreator = ctx.user?.id === place.creatorId;

  return (
    <React.Fragment>
      <Modal
        show={isMapVisible}
        onCancel={closeMapHandler}
        header={place.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={place.coordinate} zoom={8} />
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
          <div className="place-item__image">
            <img src={place.imageUrl} alt={place.title + "image"} />
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
            {isCreator && <Button to={`/places/${place.id}`}>EDIT</Button>}
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
