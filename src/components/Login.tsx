import { useDispatch } from "react-redux";
import { setDisplayedComponent } from "../store/global/globalSlice"
import { useState } from "react";
import { loginAction } from "../store/user/userActions";

function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  
  return (
    <div>
      <h1>Login</h1>
      <p>Enter your email</p>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
      <p>Enter your password</p>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
      <button onClick={() => dispatch(loginAction({ email, password }))}>Login</button>
      <p>Don't have an account? Create one <a href="#" onClick={() => dispatch(setDisplayedComponent('signup'))}>here</a></p>
    </div>
  )
}

export default Login