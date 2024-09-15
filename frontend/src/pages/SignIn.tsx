import { useCallback, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { usePocket } from "../contexts/PocketContext";

export const SignIn = () => {
  const { login } = usePocket();
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: ""
  })

  const handleOnSubmit = useCallback(
    async (evt: { preventDefault: () => void; }) => {
      evt?.preventDefault();
      await login({
        email: data.email,
        password: data.password
      });
      navigate("/");
    },
    [login]
  );

  return (
    <section>
      <h2>Sign In</h2>
      <form onSubmit={handleOnSubmit}>
        <input placeholder="Email" type="email" value={data.email} onChange={e => setData({...data, email: e.target.value})} />
        <input placeholder="Password" type="password" value={data.password} onChange={e => setData({...data, password: e.target.value})} />
        <button type="submit">Login</button>
        <Link to="/">Go to Sign Up</Link>
      </form>
    </section>
  );
};
