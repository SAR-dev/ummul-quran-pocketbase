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
import { useInterval } from "usehooks-ts";
import { jwtDecode } from "jwt-decode";
import { ClassLogsResponse, Collections, StudentsResponse, TeachersResponse, TypedPocketBase } from "../types/pocketbase";
import { TexpandStudentWithPackage, TexpandUser } from "../types/extend";
import { dateToUtc } from "../packages/EventCalendar/helpers/calendar";

interface DecodedToken {
    exp: number;
}

const oneMinInMs = 60000;

interface PocketContextType {
    pb: TypedPocketBase;
    login: ({ email, password }: { email: string; password: string }) => Promise<void>;
    logout: () => void;
    user?: AuthModel;
    token: string | null;
    teacher?: TeachersResponse<TexpandUser>;
    students: StudentsResponse<TexpandUser>[];
    getClassLogsData: ({ start, end }: { start: string, end: string }) => Promise<ClassLogsResponse<TexpandStudentWithPackage>[]>
}

const PocketContext = createContext<PocketContextType | undefined>(undefined);

export const PocketProvider = ({ children }: { children: ReactNode }) => {
    const pb = useMemo(() => new PocketBase(import.meta.env.VITE_API_URL) as TypedPocketBase, []);

    const [token, setToken] = useState<string | null>(pb.authStore.token);
    const [user, setUser] = useState(pb.authStore.model);
    const [teacher, setTeacher] = useState<TeachersResponse<TexpandUser>>()
    const [students, setStudents] = useState<StudentsResponse<TexpandUser>[]>([])

    useEffect(() => {
        pb.authStore.onChange((newToken, model) => {
            setToken(newToken);
            setUser(model);
        });
        fetchTeacherData()
        fetchStudentListData()
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

        // if signed in user is not teacher log user out
        if (res == null) {
            logout()
            return;
        }
        setTeacher(res)
    }, [pb]);

    const fetchStudentListData = useCallback(async () => {
        const userId = user?.id;
        if (!userId) {
            setStudents([]);
            return;
        }
        const res = await pb
            .collection(Collections.Students)
            .getFullList<StudentsResponse<TexpandUser>>({
                filter: `teacher.user.id = "${userId}"`,
                expand: "user",
            });
        setStudents(res)
    }, [pb]);

    const login = useCallback(async ({ email, password }: { email: string; password: string }) => {
        await pb.collection(Collections.Users).authWithPassword(email, password);
    }, [pb]);

    const logout = useCallback(() => {
        pb.authStore.clear();
    }, [pb]);

    const refreshSession = useCallback(async () => {
        if (!pb.authStore.isValid) return;
        const decoded = jwtDecode<DecodedToken>(token!);
        const tokenExpiration = decoded.exp ?? 0;
        const expirationWithBuffer = (tokenExpiration + 5 * oneMinInMs) / 1000;
        if (Date.now() / 1000 < expirationWithBuffer) {
            await pb.collection(Collections.Users).authRefresh();
        }
    }, [pb, token]);

    function formatDateToCustomString(date: Date) {
        date.setHours(0, 0, 0, 0);
        return dateToUtc(date)
    }

    const getClassLogsData = useCallback(async ({ start, end }: { start: string, end: string }) => {
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
                requestKey: `${userId}${startUTC}${endUTC}`
            });
        return res
    }, [pb]);

    useInterval(refreshSession, token ? 2 * oneMinInMs : null);

    return (
        <PocketContext.Provider value={{
            pb,
            login,
            logout,
            user,
            token,
            teacher,
            students,
            getClassLogsData
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