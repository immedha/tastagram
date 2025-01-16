import { useSelector } from "react-redux"
import { selectUsername } from "../store/user/userSlice";

function Home() {
  const username = useSelector(selectUsername);
  return (
    <div>
      <h1>Home</h1>
      <p>Welcome, {username}</p>
    </div>
  )
}

export default Home