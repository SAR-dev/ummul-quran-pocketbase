import { usePocket } from "../contexts/PocketContext";
import NavLayout from "../layouts/NavLayout";
import ClassCalendar from "../components/ClassCalendar/ClassCalendar";
import { TodayClassList } from "../components/TodayClassList";

export const HomePage = () => {
  const { user, teacher, students, } = usePocket();

  return (
    <NavLayout>
      <div className="grid grid-cols-1 md:grid-cols-4 w-full">
        <div className="col-span-1 md:col-span-3">
          <div className="p-5 md:p-16 w-full grid grid-cols-1 gap-10">
            <TodayClassList />
            <ClassCalendar />
            {/* <StudentList /> */}
          </div>
        </div>
        <div className="col-span-1 p-5 md:py-16">
          {/* <ClassHistory /> */}
        </div>
      </div>
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
      </section>
    </NavLayout>
  );
};
