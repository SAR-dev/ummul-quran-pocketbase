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
import ms from "ms";
import { TypedPocketBase } from "../types/pocketbase";

interface DecodedToken {
    exp: number;
}

const fiveMinutesInMs = ms("5 minutes");
const twoMinutesInMs = ms("2 minutes");

interface PocketContextType {
    login: ({ email, password }: { email: string; password: string }) => Promise<void>;
    logout: () => void;
    user?: AuthModel;
    pb: TypedPocketBase;
}

const PocketContext = createContext<PocketContextType | undefined>(undefined);

export const PocketProvider = ({ children }: { children: ReactNode }) => {
    const pb = useMemo(() => new PocketBase(import.meta.env.VITE_API_URL) as TypedPocketBase, []);

    const [token, setToken] = useState<string | null>(pb.authStore.token);
    const [user, setUser] = useState(pb.authStore.model);

    useEffect(() => {
        return pb.authStore.onChange((newToken, model) => {
            setToken(newToken);
            setUser(model);
        });
    }, [pb]);

    const login = useCallback(async ({ email, password }: { email: string; password: string }) => {
        await pb.collection("users").authWithPassword(email, password);
    }, [pb]);

    const logout = useCallback(() => {
        pb.authStore.clear();
    }, [pb]);

    const refreshSession = useCallback(async () => {
        if (!pb.authStore.isValid) return;
        const decoded = jwtDecode<DecodedToken>(token!); 
        const tokenExpiration = decoded.exp ?? 0;
        const expirationWithBuffer = (tokenExpiration + fiveMinutesInMs) / 1000;
        if (Date.now() / 1000 < expirationWithBuffer) {
            await pb.collection("users").authRefresh();
        }
    }, [pb, token]);

    useInterval(refreshSession, token ? twoMinutesInMs : null);

    return (
        <PocketContext.Provider value={{ login, logout, user, pb }}>
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
