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

// Define a type for the decoded JWT token
interface DecodedToken {
    exp: number;
}

const fiveMinutesInMs = ms("5 minutes");
const twoMinutesInMs = ms("2 minutes");

// Define the shape of PocketContext
interface PocketContextType {
    login: ({ email, password }: { email: string; password: string }) => Promise<void>;
    logout: () => void;
    user?: AuthModel;
    token: string | null;
    pb: TypedPocketBase;
}

// Create PocketContext with an initial value of undefined
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
        const decoded = jwtDecode<DecodedToken>(token!); // Use non-null assertion since token is checked later
        const tokenExpiration = decoded.exp ?? 0;
        const expirationWithBuffer = (tokenExpiration + fiveMinutesInMs) / 1000;
        if (Date.now() / 1000 < expirationWithBuffer) {
            await pb.collection("users").authRefresh();
        }
    }, [pb, token]);

    useInterval(refreshSession, token ? twoMinutesInMs : null);

    return (
        <PocketContext.Provider value={{ login, logout, user, token, pb }}>
            {children}
        </PocketContext.Provider>
    );
};

// Custom hook to access PocketContext
export const usePocket = () => {
    const context = useContext(PocketContext);
    if (!context) {
        throw new Error("usePocket must be used within a PocketProvider");
    }
    return context;
};
