import { useDispatch, useSelector } from 'react-redux';
import { selectUserId } from '../store/user/userSlice';
import { setDisplayedComponent } from '../store/global/globalSlice';

function Navbar() {
  const userId = useSelector(selectUserId);
  const dispatch = useDispatch();

  return (
    <nav>
      <p>Tastagram</p>
      <ul>
        <li>
          <button onClick={() => dispatch(setDisplayedComponent("home"))}>
            Feed
          </button>
        </li>
        <li>
          <button onClick={() => userId ? dispatch(setDisplayedComponent("logout")) : dispatch(setDisplayedComponent("login"))}>
            {userId ? "Profile" : "Log In"}
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;