import { user } from "../../../typing/interfaces";
import { UsersList } from "../components/UsersList";

export function Users() {
  let dUser1 = {
    id: 1,
    name: "sleeman nabwani",
    email: "sleeman.nabwani@gmail.com",
    image:
      "https://media-exp1.licdn.com/dms/image/C4D03AQFcazRe-w1HAQ/profile-displayphoto-shrink_200_200/0/1664217952339?e=1675296000&v=beta&t=BbTNzfIXIBwBtIjWFmoayt3AWobOiK28azdyPHBCQVo",
    placesCount: 4,
  };

  const USERS: user[] = [dUser1];

  return <UsersList users={USERS} />;
}
