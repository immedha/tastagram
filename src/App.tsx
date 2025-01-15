import { useEffect } from "react";
import Cookies from "universal-cookie";
import Login from "./components/Login";
import Home from "./components/Home";
import { selectDisplayedComponent, setDisplayedComponent } from "./store/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import Signup from "./components/Signup";
import Navbar from "./components/Navbar";
import { fetchInitialDataAction } from "./store/user/userActions";
import Logout from "./components/Logout";
import { selectUserId, setUserId } from "./store/user/userSlice";

function App() {
  const dispatch = useDispatch();
  const displayedComponent = useSelector(selectDisplayedComponent);
  const userId = useSelector(selectUserId);

  useEffect(() => {
    if (userId) {
      console.log('fetch initial data!!!');
      dispatch(fetchInitialDataAction({userId}));
      dispatch(setDisplayedComponent("home"));
    } else {
      dispatch(setDisplayedComponent("login"));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    const cookies = new Cookies();
    const alreadyLoggedIn = cookies.get("userId");
    if (alreadyLoggedIn) {
      dispatch(setUserId(alreadyLoggedIn));
    }
  }, [dispatch]);

  const componentToDisplay = () => {
    if (displayedComponent == "login") {
      return <Login />;
    } else if (displayedComponent == "home") {
      return <Home userId={userId} />;
    } else if (displayedComponent == "signup") {
      return <Signup />;
    } else if (displayedComponent == "logout") {
      return <Logout />;
    } else {
      return null;
    }
  }

  return (
    <>
      <Navbar />
      {componentToDisplay()}
    </>
  )
}

export default App
