import { useDispatch } from "react-redux";
import { logoutAction } from "../store/user/userActions";

function Logout() {
  const dispatch = useDispatch();

  return (
    <div>
      <button onClick={() => dispatch(logoutAction())}>Logout</button>
    </div>
  )
}

export default Logout;