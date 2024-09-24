import { useState } from "react";
import { usePocket } from "../contexts/PocketContext";
import { ErrorResponseType } from "../types/extend";
import { useNotification } from "../contexts/NotificationContext";
import { NotificationType } from "../types/notification";

export const SignIn = () => {
  const { login } = usePocket();
  const notification = useNotification()
  const [isLoading, setsLoading] = useState(false)
  const [data, setData] = useState({
    email: "",
    password: ""
  })

  const handleOnSubmit = async () => {
    const { email, password } = data
    setsLoading(true)
    try {
      await login({ email, password });
      setsLoading(false)
      window.location.reload();
    } catch (err) {
      const error = err as ErrorResponseType;
      notification.add({
        title: "Error Occured",
        message: error.response.message ?? "An error occured. Please try again later!",
        status: NotificationType.ERROR,
      })
      setsLoading(false)
    }
  };

  return (
    <section className="flex h-screen w-full justify-center items-center">
      <div className="w-full max-w-sm p-6 m-auto mx-auto bg-base-200 rounded-lg shadow-md">
        <div className="flex justify-center mx-auto">
          <img
            className="w-auto h-7 sm:h-8"
            src="https://merakiui.com/images/logo.svg"
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
          <div className="mt-6">
            <button className="w-full btn btn-icon btn-neutral" disabled={isLoading} onClick={handleOnSubmit}>
              {isLoading && <div className="loading w-5 h-5" />}
              Sign In
            </button>
          </div>
        </form>
        <div className="flex items-center justify-between mt-4">
          <span className="w-1/5 border-b lg:w-1/5 border-base-content/50" />
          <div
            className="text-xs text-center text-base-content/50 uppercase"
          >
            or login with Social Media
          </div>
          <span className="w-1/5 border-b lg:w-1/5 border-base-content/50" />
        </div>
        <div className="flex items-center mt-6 -mx-2">
          <button
            type="button"
            className="btn btn-icon btn-info flex-1"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"></path>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </section>
  );
};
