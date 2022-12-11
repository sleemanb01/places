import Card from "../../shared/components/UIElements/Card";
import { user } from "../../../typing/interfaces";
import { UserItem } from "./UserItem";

import "./UsersList.css";

export function UsersList({ users }: { users: user[] }) {
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
        <UserItem key={(curr.id as number).toString()} user={curr} />
      ))}
    </ul>
  );
}
