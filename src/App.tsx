import { useEffect } from "react";
import Cookies from "universal-cookie";
import Login from "./components/Login";
import Feed from "./components/Feed";
import { selectDisplayedComponent, setDisplayedComponent } from "./store/global/globalSlice";
import { useDispatch, useSelector } from "react-redux";
import Signup from "./components/Signup";
import Navbar from "./components/Navbar";
import { fetchInitialDataAction } from "./store/user/userActions";
import Profile from "./components/Profile";
import { selectUserId, setUserId } from "./store/user/userSlice";

function App() {
  const dispatch = useDispatch();
  const displayedComponent = useSelector(selectDisplayedComponent);
  const userId = useSelector(selectUserId);

  useEffect(() => {
    if (userId) {
      console.log('fetching data');
      dispatch(fetchInitialDataAction({userId}));
      dispatch(setDisplayedComponent("feed"));
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
    } else if (displayedComponent == "feed") {
      return <Feed />;
    } else if (displayedComponent == "signup") {
      return <Signup />;
    } else if (displayedComponent == "logout") {
      return <Profile />;
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
