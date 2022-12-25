import { Link } from "react-router-dom";
import { IUser } from "../../../typing/interfaces";
import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";

import "./UserItem.css";

export function UserItem({ user }: { user: IUser }) {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${user.id}/places`}>
          <div className="user-item__image">
            {user.image && (
              <Avatar image={user.image} alt={user.name + "image"} />
            )}
          </div>
          <div className="user-item__info">
            <h2>{user.name}</h2>
            <h3>
              {user.placesCount} {user.placesCount === 1 ? "place" : "places"}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
}
