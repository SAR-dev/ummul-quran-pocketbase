import { useEffect, useState } from "react";
import { usePocket } from "../contexts/PocketContext";
import { Collections, StudentsResponse, TeachersResponse, UsersResponse } from "../types/pocketbase";
import { TexpandUser } from "../types/extend";

export const Protected = () => {
  const { logout, user, pb } = usePocket();
  const [teacher, setTeacher] = useState<TeachersResponse<TexpandUser>>()
  const [students, setStudents] = useState<StudentsResponse<TexpandUser>[]>([])

  const fetchTeacherData = async () => {
    const userId = user?.id;
    if (!userId) return;
    const res = await pb
      .collection(Collections.Teachers)
      .getFirstListItem<TeachersResponse<TexpandUser>>(`user.id = "${userId}"`, {
        expand: "user",
      });
    setTeacher(res)
  };

  const fetchStudentListData = async () => {
    const userId = user?.id;
    if (!userId) return;
    const res = await pb
      .collection(Collections.Students)
      .getFullList<StudentsResponse<TexpandUser>>({
        filter: `teacher.user.id = "${userId}"`,
        expand: "user",
      });
      setStudents(res)
  };

  useEffect(() => {
    fetchTeacherData();
    fetchStudentListData();
  }, [pb, user]);



  return (
    <section className="flex flex-col gap-5 p-5">
      <div className="bg-base-200 p-2 rounded">
        <h2 className="text-xl mb-3 pb-3 border-b border-base-300">User</h2>
        <pre className="text-xs">
          <code>{JSON.stringify(user, null, 2)}</code>
        </pre>
      </div>
      <div className="bg-base-200 p-2 rounded">
        <h2 className="text-xl mb-3 pb-3 border-b border-base-300">Teacher</h2>
        <pre className="text-xs">
          <code>{JSON.stringify(teacher, null, 2)}</code>
        </pre>
      </div>
      <div className="bg-base-200 p-2 rounded">
        <h2 className="text-xl mb-3 pb-3 border-b border-base-300">Students</h2>
        {students.map((student, i) => (
          <pre className="text-xs" key={i}>
            <code>{JSON.stringify(student, null, 2)}</code>
          </pre>
        ))}
      </div>
      <button className="btn btn-error w-32" onClick={logout}>Logout</button>
    </section>
  );
};
