import { useDispatch, useSelector } from 'react-redux';
import { selectUserId, selectUsername } from '../store/user/userSlice';
import { selectDisplayedComponent, setDisplayedComponent } from '../store/global/globalSlice';

function Navbar() {
  const userId = useSelector(selectUserId);
  const username = useSelector(selectUsername);
  const displayedComponent = useSelector(selectDisplayedComponent);
  const dispatch = useDispatch();

  return (
    <nav>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '0px', marginBottom: '20px', }}>
        <p style={{ color: '#AA336A' }}><em>Tastagram</em></p>

        <button
          style={{
            background: 'lightpink',
            padding: '5px',
            margin: '5px',
            border: 'none',
            borderBottom: displayedComponent === 'feed' ? '2px solid gray' : 'none',
            cursor: 'pointer',
          }}
          onClick={() => dispatch(setDisplayedComponent("feed"))}
        >
          Feed
        </button>
        <button style={{ 
          background: 'lightpink',
          margin: '5px', 
          padding: '5px',
          border: 'none', 
          borderBottom: displayedComponent !== 'feed' ? '2px solid gray' : 'none', 
          cursor: 'pointer',
          }} 
          onClick={() => userId ? dispatch(setDisplayedComponent("logout")) : dispatch(setDisplayedComponent("login"))}
        >
          {(userId && username) ? "@" + username : "Log In"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;