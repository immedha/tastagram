import { useEffect } from "react";
import Cookies from "universal-cookie";
import Login from "./components/Login";
import Feed from "./components/Feed";
import { selectDisplayedComponent, selectErrorMessage, selectPageState, setDisplayedComponent } from "./store/global/globalSlice";
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
  const pageState: 'loading' | 'error' | 'idle' = useSelector(selectPageState);
  const errorMessage: string | null = useSelector(selectErrorMessage)

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

  const pageStateToDisplay = () => {
    if (pageState === 'loading') {
      return <div>Loading...</div>
    } else if (pageState === 'error') {
      return <div>There was an error! | Error message: {errorMessage} | Please refresh the page and try again.</div>
    } else {
      return <div></div>;
    }
  }

  return (
    <>
      <Navbar />
      {pageStateToDisplay()}
      {componentToDisplay()}
    </>
  )
}

export default App
