import {
    createContext,
    useContext,
    useCallback,
    useState,
    useEffect,
    useMemo,
    ReactNode,
} from "react";
import PocketBase, { AuthModel } from "pocketbase";
import { useInterval, useLocalStorage } from "usehooks-ts";
import { jwtDecode } from "jwt-decode";
import {
    ClassLogsResponse,
    Collections,
    StudentInvoicesResponse,
    StudentsResponse,
    TeachersResponse,
    TimezonesResponse,
    TypedPocketBase,
} from "../types/pocketbase";
import { TexpandStudentListWithPackage, TexpandStudentWithPackage, TexpandUser } from "../types/extend";
import { dateToUtc } from "../helpers/calendar";

interface DecodedToken {
    exp: number;
}

const oneMinInMs = 60000;

interface PocketContextType {
    pb: TypedPocketBase;
    refresh: number;
    login: ({ email, password }: { email: string; password: string }) => Promise<void>;
    logout: () => void;
    user?: AuthModel;
    token: string | null;
    teacher?: TeachersResponse<TexpandUser>;
    student?: StudentsResponse<TexpandUser>;
    students: TexpandStudentListWithPackage[];
    timeZones: TimezonesResponse[];
    getClassLogsData: ({ start, end, key }: { start: string, end: string, key?: string }) => Promise<ClassLogsResponse<TexpandStudentWithPackage>[]>;
    getClassLogDataById: ({ id }: { id: string }) => Promise<ClassLogsResponse<TexpandStudentWithPackage>>;
    deleteClassLogById: ({ id }: { id: string }) => Promise<void>;
    getStudentInvoiceData: () => Promise<StudentInvoicesResponse[]>;
}

const PocketContext = createContext<PocketContextType | undefined>(undefined);

export const PocketProvider = ({ children }: { children: ReactNode }) => {
    const pb = useMemo(() => new PocketBase(import.meta.env.VITE_API_URL) as TypedPocketBase, []);
    const [refresh, setRefresh] = useState(1)

    const [token, setToken] = useState<string | null>(pb.authStore.token);
    const [user, setUser] = useState(pb.authStore.model);
    const [students, setStudents] = useState<TexpandStudentListWithPackage[]>([])
    const [timeZones, setTimeZones] = useState<TimezonesResponse[]>([])
    const [student, setStudent] = useLocalStorage<StudentsResponse<TexpandUser> | undefined>('student', undefined)
    const [teacher, setTeacher] = useLocalStorage<TeachersResponse<TexpandUser> | undefined>('teacher', undefined)

    useEffect(() => {
        pb.authStore.onChange((newToken, model) => {
            setToken(newToken);
            setUser(model);
        });
        fetchTeacherData()
        fetchStudentData()
        fetchStudentListData()
        fetchTimezoneListData()
    }, [pb]);

    const fetchTeacherData = useCallback(async () => {
        const userId = user?.id;
        if (!userId) {
            setTeacher(undefined);
            return;
        }
        const res = await pb
            .collection(Collections.Teachers)
            .getFirstListItem<TeachersResponse<TexpandUser>>(`user.id = "${userId}"`, {
                expand: "user",
            });
        setTeacher(res)
    }, [pb]);

    const fetchStudentData = useCallback(async () => {
        const userId = user?.id;
        if (!userId) {
            setStudent(undefined);
            return;
        }
        const res = await pb
            .collection(Collections.Students)
            .getFirstListItem<StudentsResponse<TexpandUser>>(`user.id = "${userId}"`, {
                expand: "user",
            });
        setStudent(res)
    }, [pb]);

    const fetchStudentListData = useCallback(async () => {
        const userId = user?.id;
        if (!userId) {
            setStudents([]);
            return;
        }
        const res = await pb
            .collection(Collections.Students)
            .getFullList<TexpandStudentListWithPackage>({
                filter: `teacher.user.id = "${userId}"`,
                expand: "user, monthly_package",
            });
        setStudents(res)
    }, [pb]);

    const fetchTimezoneListData = useCallback(async () => {
        const res = await pb
            .collection(Collections.Timezones)
            .getFullList<TimezonesResponse>();
        setTimeZones(res)
    }, [pb]);

    const login = useCallback(async ({ email, password }: { email: string; password: string }) => {
        await pb.collection(Collections.Users).authWithPassword(email, password);
    }, [pb]);

    const logout = useCallback(() => {
        localStorage.clear()
        pb.authStore.clear();
    }, [pb]);

    const refreshSession = useCallback(async () => {
        if (!pb.authStore.isValid) {
            logout()
            return
        };
        const decoded = jwtDecode<DecodedToken>(token!);
        const tokenExpiration = decoded.exp ?? 0;
        const expirationWithBuffer = (tokenExpiration + 5 * oneMinInMs) / 1000;
        if (Date.now() / 1000 < expirationWithBuffer) {
            await pb.collection(Collections.Users).authRefresh();
        } else {
            logout()
        }
    }, [pb, token]);

    function formatDateToCustomString(date: Date) {
        date.setHours(0, 0, 0, 0);
        return dateToUtc(date)
    }

    const getClassLogsData = useCallback(async ({ start, end, key }: { start: string, end: string, key?: string }) => {
        const userId = user?.id;
        if (!userId) {
            return [];
        }

        const startUTC = formatDateToCustomString(new Date(start));
        const endUTC = formatDateToCustomString(new Date(end));

        const res = await pb
            .collection(Collections.ClassLogs)
            .getFullList<ClassLogsResponse<TexpandStudentWithPackage>>({
                filter: `student.teacher.user.id = "${userId}" && start_at >= "${startUTC}" && start_at < "${endUTC}"`,
                expand: "student, student.user, student.monthly_package",
                requestKey: `${userId}${startUTC}${endUTC}${key}`
            });
        return res
    }, [pb]);

    const getClassLogDataById = useCallback(async ({ id }: { id: string }) => {
        const res = await pb
            .collection(Collections.ClassLogs)
            .getOne<ClassLogsResponse<TexpandStudentWithPackage>>(id, {
                expand: "student, student.user, student.monthly_package",
                requestKey: `${id}`
            });
        return res
    }, [pb]);

    const deleteClassLogById = useCallback(async ({ id }: { id: string }) => {
        await pb
            .collection(Collections.ClassLogs)
            .delete(id);
        setRefresh(refresh + 1)
    }, [pb]);

    const getStudentInvoiceData = useCallback(async () => {
        const userId = user?.id;
        if (!userId) {
            return [];
        }

        const res = await pb
            .collection(Collections.StudentInvoices)
            .getFullList<StudentInvoicesResponse>({
                filter: `student.user.id = "${userId}"`
            });
        return res
    }, [pb]);

    useInterval(refreshSession, token ? 2 * oneMinInMs : null);

    return (
        <PocketContext.Provider value={{
            pb,
            refresh,
            login,
            logout,
            user,
            token,
            teacher,
            student,
            students,
            timeZones,
            getClassLogsData,
            getClassLogDataById,
            deleteClassLogById,
            getStudentInvoiceData
        }}>
            {children}
        </PocketContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePocket = () => {
    const context = useContext(PocketContext);
    if (!context) throw new Error();
    return context;
};