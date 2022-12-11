import { useContext } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { Users } from "./FC/user/pages/Users";
import { Places } from "./FC/places/pages/Places";
import { MainNavigation } from "./FC/shared/components/Navigation/MainNavigation";
import { NewPlace } from "./FC/places/pages/NewPlace";
import { UpdatePlace } from "./FC/places/pages/UpdatePlace";
import { Auth } from "./FC/user/pages/Auth";
import { AuthContext } from "./hooks/auth-context";

function App() {
  const authCtx = useContext(AuthContext);
  console.log("app");

  let routes;

  if (authCtx.isLoggedIn) {
    routes = (
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/:userId/places" element={<Places />} />
        <Route path="/places/new" element={<NewPlace />} />
        <Route path="/places/:placeId" element={<UpdatePlace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/:userId/places" element={<Places />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <Router>
      <MainNavigation />
      <main>{routes}</main>
    </Router>
  );
}

export default App;
