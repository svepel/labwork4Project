import { User, onAuthStateChanged, signOut } from "firebase/auth";
import {
	PropsWithChildren,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import { FIREBASE_AUTH } from "../config/FirebaseConfig";
import { Redirect } from "react-router";

interface AuthProps {
	user?: User | null;
	initialized?: boolean;
	logout?: () => Promise<void>;
}

export const AuthContext = createContext<AuthProps>({});

export function useAuth() {
	return useContext(AuthContext);
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const [user, setUser] = useState<User | null>(null);
	const [initialized, setInitialized] = useState<boolean>(false);

	useEffect(() => {
		onAuthStateChanged(FIREBASE_AUTH, (user) => {
			console.log("AUTH CHANGED: ", user);

			setUser(user);
			setInitialized(true);
		});
	}, []);

	const value = {
		user,
		initialized,
		logout: () => signOut(FIREBASE_AUTH),
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const AuthenticatedRoute = ({ children }: any) => {
	const { user, initialized } = useAuth();

	if (!initialized) {
		return;
	}

	return user ? children : <Redirect to="/" />;
};
