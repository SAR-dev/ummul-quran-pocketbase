import { useState } from "react";
import { usePocket } from "../contexts/PocketContext";
import { ErrorResponseType } from "../types/extend";
import { useNotification } from "../contexts/NotificationContext";
import { NotificationType } from "../types/notification";
import Logo from "../assets/logo.png";

export const SignIn = () => {
  const { login } = usePocket();
  const notification = useNotification()
  const [isLoading, setIsLoading] = useState(false)
  const [asAdmin, setAsAdmin] = useState(false)
  const [data, setData] = useState({
    email: "",
    password: ""
  })

  const handleOnSubmit = async () => {
    const { email, password } = data
    setIsLoading(true)
    try {
      await login({ email, password, asAdmin });
      setIsLoading(false)
      window.location.reload();
    } catch (err) {
      const error = err as ErrorResponseType;
      notification.add({
        title: "Error Occured",
        message: error.response.message ?? "An error occured. Please try again later!",
        status: NotificationType.ERROR,
      })
      setIsLoading(false)
    }
  };

  return (
    <section className="flex h-screen w-full justify-center items-center">
      <div className="w-full max-w-sm p-6 m-auto mx-auto bg-base-200 rounded-lg shadow-md">
        <div className="flex justify-center mx-auto">
          <img
            className="w-auto h-8 sm:h-16"
            src={Logo}
            alt=""
          />
        </div>
        <form className="mt-6">
          <div>
            <label htmlFor="username" className="block text-sm text-base-content">
              Email
            </label>
            <input
              type="text"
              className="input w-full input-bordered mt-2"
              value={data.email}
              onChange={e => setData({ ...data, email: e.target.value })}
            />
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm text-base-content">
                Password
              </label>
            </div>
            <input
              type="password"
              className="input w-full input-bordered mt-2"
              value={data.password}
              onChange={e => setData({ ...data, password: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2 text-sm mt-2">
            <input
              type="checkbox"
              className="toggle toggle-sm toggle-success"
              checked={asAdmin}
              onChange={e => setAsAdmin(e.target.checked)}
            />
            <div>Admin</div>
          </div>
          <div className="mt-6">
            <button className="w-full btn btn-icon btn-neutral" disabled={isLoading} onClick={handleOnSubmit}>
              {isLoading && <div className="loading w-5 h-5" />}
              Sign In
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
