import {
    createContext,
    useContext,
    useCallback,
    useState,
    useEffect,
    useMemo,
    ReactNode,
} from "react";
import PocketBase, { AuthModel, getTokenPayload } from "pocketbase";
import { useInterval, useLocalStorage } from "usehooks-ts";
import { jwtDecode } from "jwt-decode";
import {
    ClassLogsResponse,
    Collections,
    MonthlyPackagesResponse,
    StudentInvoicesResponse,
    StudentsResponse,
    TeacherInvoicesResponse,
    TeachersResponse,
    TimezonesResponse,
    TypedPocketBase,
} from "../types/pocketbase";
import { TexpandStudent, TexpandStudentListWithPackage, TexpandStudentWithPackage, TexpandTeacher, TexpandUser } from "../types/extend";
import { dateToUtc } from "../helpers/calendar";

interface DecodedToken {
    exp: number;
}

const oneMinInMs = 60000;

interface PocketContextType {
    pb: TypedPocketBase;
    isAdmin: boolean;
    refresh: number;
    incRefresh: () => void;
    login: ({ email, password, asAdmin }: { email: string; password: string, asAdmin?: boolean }) => Promise<void>;
    logout: () => void;
    user?: AuthModel;
    token: string | null;
    teacher?: TeachersResponse<TexpandUser>;
    student?: StudentsResponse<TexpandUser>;
    students: TexpandStudentListWithPackage[];
    timeZones: TimezonesResponse[];
    packages: MonthlyPackagesResponse[];
    getClassLogsData: ({ start, end, key, studentId }: { start: string, end: string, key?: string, studentId?: string }) => Promise<ClassLogsResponse<TexpandStudentWithPackage>[]>;
    getClassLogDataById: ({ id }: { id: string }) => Promise<ClassLogsResponse<TexpandStudentWithPackage>>;
    deleteClassLogById: ({ id }: { id: string }) => Promise<void>;
    getStudentInvoiceData: () => Promise<StudentInvoicesResponse[]>;
    getStudentInvoiceListData: ({ start, end }: { start: string, end: string }) => Promise<StudentInvoicesResponse<TexpandStudent>[]>;
    updateStudentInvoiceData: ({ id, paid_amount, note }: { id: string, paid_amount: number, note: string }) => Promise<void>;
    getTeacherInvoiceListData: ({ start, end }: { start: string, end: string }) => Promise<TeacherInvoicesResponse<TexpandTeacher>[]>;
    updateTeacherInvoiceData: ({ id, paid_amount, note }: { id: string, paid_amount: number, note: string }) => Promise<void>;
}

const PocketContext = createContext<PocketContextType | undefined>(undefined);

export const PocketProvider = ({ children }: { children: ReactNode }) => {
    const pb = useMemo(() => new PocketBase(import.meta.env.VITE_API_URL) as TypedPocketBase, []);
    const [refresh, setRefresh] = useState(1)

    const [token, setToken] = useState<string | null>(pb.authStore.token);
    const [user, setUser] = useState(pb.authStore.model);
    const [isAdmin, setIsAdmin] = useState(getTokenPayload(pb.authStore.token).type == "admin")
    const [students, setStudents] = useState<TexpandStudentListWithPackage[]>([])
    const [timeZones, setTimeZones] = useState<TimezonesResponse[]>([])
    const [packages, setPackages] = useState<MonthlyPackagesResponse[]>([])
    const [student, setStudent] = useLocalStorage<StudentsResponse<TexpandUser> | undefined>('student', undefined)
    const [teacher, setTeacher] = useLocalStorage<TeachersResponse<TexpandUser> | undefined>('teacher', undefined)

    useEffect(() => {
        if (!pb.authStore.isValid) logout()
    }, [])


    useEffect(() => {
        pb.authStore.onChange((newToken, model) => {
            setIsAdmin(getTokenPayload(newToken).type == "admin")
            setToken(newToken);
            setUser(model);
        });
        fetchTeacherData()
        fetchStudentData()
        fetchStudentListData()
        fetchTimezoneListData()
        fetchMonthlyPackages()
    }, [pb]);

    const incRefresh = () => setRefresh(refresh + 1)

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

    const fetchMonthlyPackages = useCallback(async () => {
        const res = await pb
            .collection(Collections.MonthlyPackages)
            .getFullList<MonthlyPackagesResponse>();
        setPackages(res)
    }, [pb]);

    const login = useCallback(async ({ email, password, asAdmin }: { email: string; password: string, asAdmin?: boolean }) => {
        if (asAdmin) {
            await pb.admins.authWithPassword(email, password);
        } else {
            await pb.collection(Collections.Users).authWithPassword(email, password);
        }
    }, [pb]);

    const logout = useCallback(() => {
        localStorage.clear()
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

    const getClassLogsData = useCallback(async ({ start, end, key, studentId }: { start: string, end: string, key?: string, studentId?: string }) => {
        const userId = user?.id;
        if (!userId) {
            return [];
        }

        const startUTC = formatDateToCustomString(new Date(start));
        const endUTC = formatDateToCustomString(new Date(end));

        const res = await pb
            .collection(Collections.ClassLogs)
            .getFullList<ClassLogsResponse<TexpandStudentWithPackage>>({
                filter: `student.teacher.user.id = "${userId}" && start_at >= "${startUTC}" && start_at < "${endUTC}" ${studentId && studentId?.length > 0 ? `&& student.id = "${studentId}"` : ""}`,
                expand: "student, student.user, student.monthly_package",
                requestKey: `${userId}${startUTC}${endUTC}${studentId}${key}`
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

    const getStudentInvoiceListData = useCallback(async ({ start, end }: { start: string, end: string }) => {
        if (!isAdmin) {
            return [];
        }

        const startUTC = formatDateToCustomString(new Date(start));
        const endUTC = formatDateToCustomString(new Date(end));

        const res = await pb
            .collection(Collections.StudentInvoices)
            .getFullList<StudentInvoicesResponse<TexpandStudent>>({
                expand: "student",
                filter: `created >= "${startUTC}" && created < "${endUTC}"`
            });
        return res
    }, [pb]);

    const updateStudentInvoiceData = useCallback(async ({ id, paid_amount, note }: { id: string, paid_amount: number, note: string }) => {
        if (!isAdmin) return;

        await pb
            .collection(Collections.StudentInvoices)
            .update(id, {
                paid_amount,
                note
            });
        setRefresh(refresh + 1)
    }, [pb]);

    const getTeacherInvoiceListData = useCallback(async ({ start, end }: { start: string, end: string }) => {
        if (!isAdmin) {
            return [];
        }

        const startUTC = formatDateToCustomString(new Date(start));
        const endUTC = formatDateToCustomString(new Date(end));

        const res = await pb
            .collection(Collections.TeacherInvoices)
            .getFullList<TeacherInvoicesResponse<TexpandTeacher>>({
                expand: "teacher",
                filter: `created >= "${startUTC}" && created < "${endUTC}"`
            });
        return res
    }, [pb]);

    const updateTeacherInvoiceData = useCallback(async ({ id, paid_amount, note }: { id: string, paid_amount: number, note: string }) => {
        if (!isAdmin) return;

        await pb
            .collection(Collections.TeacherInvoices)
            .update(id, {
                paid_amount,
                note
            });
        setRefresh(refresh + 1)
    }, [pb]);

    useInterval(refreshSession, token ? 2 * oneMinInMs : null);

    return (
        <PocketContext.Provider value={{
            pb,
            isAdmin,
            refresh,
            incRefresh,
            login,
            logout,
            user,
            token,
            teacher,
            student,
            students,
            timeZones,
            packages,
            getClassLogsData,
            getClassLogDataById,
            deleteClassLogById,
            getStudentInvoiceData,
            getStudentInvoiceListData,
            updateStudentInvoiceData,
            getTeacherInvoiceListData,
            updateTeacherInvoiceData
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