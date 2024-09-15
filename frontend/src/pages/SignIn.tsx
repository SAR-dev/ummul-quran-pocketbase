import { FormEvent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePocket } from "../contexts/PocketContext";
import { KeyIcon, UserIcon } from "@heroicons/react/24/outline";

export const SignIn = () => {
  const { login } = usePocket();
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: ""
  })

  const handleOnSubmit = useCallback(
    async (evt: FormEvent<HTMLFormElement>) => {
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
    <section className="flex h-screen w-full justify-center items-center">
      <div className="flex flex-col">
        <h2 className="text-center mb-5 text-2xl font-medium">Sign In</h2>
        <form className="flex flex-col gap-3 w-64" onSubmit={handleOnSubmit}>
          <label className="input input-bordered flex items-center gap-2">
            <UserIcon className="h-5 w-6" />
            <input
              className="grow"
              placeholder="Email"
              type="email"
              value={data.email}
              onChange={e => setData({ ...data, email: e.target.value })}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <KeyIcon className="h-5 w-6" />
            <input
              className="grow"
              placeholder="Password"
              type="password"
              value={data.password}
              onChange={e => setData({ ...data, password: e.target.value })}
            />
          </label>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
      </div>
    </section>
  );
};
