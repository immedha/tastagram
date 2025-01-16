import { useDispatch } from "react-redux"
import { setDisplayedComponent } from "../store/global/globalSlice"
import { signUpAction } from "../store/user/userActions";
import { useState } from "react";

function Signup() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>("immedha@outlook.com");
  const [password, setPassword] = useState<string>("test123");
  const [username, setUsername] = useState<string>("immedha");

  return (
    <div>
      <h1>Sign up</h1>
      <p>Enter your email</p>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
      <p>Create a username</p>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
      <p>Create a password</p>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
      {/* check that username doesn't already exist */}
      <button onClick={() => dispatch(signUpAction({email, username, password}))}>Sign up</button> 
      <p>Already have an account? Login <a href="#" onClick={() => dispatch(setDisplayedComponent('login'))}>here</a></p>
    </div>
  )
}

export default Signup