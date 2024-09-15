import { usePocket } from "../contexts/PocketContext";
import { Link } from "react-router-dom";

export const HomePage = () => {
  const { logout, user, teacher, students } = usePocket();

  return (
    <section className="flex flex-col gap-5 p-5">
      <div className="bg-base-200 p-2 rounded">
        <div className="text-xl mb-3 pb-3 border-b border-base-300">User</div>
        <pre className="text-xs">
          <code>{JSON.stringify(user, null, 2)}</code>
        </pre>
      </div>
      <div className="bg-base-200 p-2 rounded">
        <div className="text-xl mb-3 pb-3 border-b border-base-300">Teacher</div>
        <pre className="text-xs">
          <code>{JSON.stringify(teacher, null, 2)}</code>
        </pre>
      </div>
      <div className="bg-base-200 p-2 rounded">
        <div className="text-xl mb-3 pb-3 border-b border-base-300">Students</div>
        {students.map((student, i) => (
          <pre className="text-xs" key={i}>
            <code>{JSON.stringify(student, null, 2)}</code>
          </pre>
        ))}
      </div>
      <div className="bg-base-200 p-2 rounded">
        <div className="text-xl mb-3 pb-3 border-b border-base-300 flex justify-between items-center w-full">
          Class Plans
          <Link to="/class-planner" className="btn btn-xs btn-info">Class Planner</Link>
        </div>
        {/* {students.map((student, i) => (
          <pre className="text-xs" key={i}>
            <code>{JSON.stringify(student, null, 2)}</code>
          </pre>
        ))} */}
      </div>
      <button className="btn btn-error w-32" onClick={logout}>Logout</button>
    </section>
  );
};
