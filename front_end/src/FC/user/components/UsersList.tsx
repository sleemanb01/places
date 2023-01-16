import Card from "../../shared/components/UIElements/Card";
import { IUser } from "../../../typing/interfaces";
import { UserItem } from "./UserItem";

import "./UsersList.css";

export function UsersList({ users }: { users: IUser[] }) {
  if (users.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {users.map((curr) => (
        <UserItem key={curr._id} user={curr} />
      ))}
    </ul>
  );
}
