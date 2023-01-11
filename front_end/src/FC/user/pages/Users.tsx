import React from "react";
import { useEffect, useState } from "react";
import { useHttpClient } from "../../../hooks/http-hook";
import { IUser } from "../../../typing/interfaces";
import { ENDPOINT_GETUSERS } from "../../../util/Constants";
import { ErrorModal } from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { UsersList } from "../components/UsersList";

/* ************************************************************************************************** */

function Users() {
  const [users, setUsers] = useState<IUser[]>([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(ENDPOINT_GETUSERS);

        setUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  /* ************************************************************************************************** */

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && users && <UsersList users={users} />}
    </React.Fragment>
  );
}

export default Users;
