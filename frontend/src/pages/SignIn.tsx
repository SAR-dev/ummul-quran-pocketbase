import { useState } from "react";
import { usePocket } from "../contexts/PocketContext";
import { KeyIcon, UserIcon } from "@heroicons/react/24/outline";
import { ErrorResponseType } from "../types/extend";
import { useNotification } from "../contexts/NotificationContext";
import { NotificationType } from "../types/notification";

export const SignIn = () => {
  const { login } = usePocket();
  const notification = useNotification()
  const [data, setData] = useState({
    email: "",
    password: ""
  })

  const handleOnSubmit = async () => {
    const { email, password } = data
    try {
      await login({ email, password });
      window.location.reload();
    } catch (err) {
      const error = err as ErrorResponseType;
      notification.add({
        title: "Error Occured",
        message: error.response.message ?? "An error occured. Please try again later!",
        status: NotificationType.ERROR,
      })
    }
  };

  return (
    <section className="flex h-screen w-full justify-center items-center">
      <div className="card flex flex-col border-2 border-base-300 p-5 w-96">
        <h2 className="text-center mb-5 text-2xl font-medium">Sign In</h2>
        <div className="flex flex-col gap-3">
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
          <button className="btn btn-primary" onClick={handleOnSubmit}>Login</button>
        </div>
      </div>
    </section>
  );
};
