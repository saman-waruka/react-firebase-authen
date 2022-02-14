import { onAuthStateChanged, User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "./firebase";

type ContextProps = {
    user: User | null;
    authenticated: boolean;
    setUser: any;
    loadingAuthState: boolean;
};

export const AuthContext = React.createContext<Partial<ContextProps>>({});

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState(null as User | null);
    const [loadingAuthState, setLoadingAuthState] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth,(user: any) => {
            setUser(user);
            setLoadingAuthState(false);
            console.log(user, 'ap user');
            console.log(user !== null, 'ap authenticated');
        });
    }, []);

    return (
        <AuthContext.Provider 
            value={{
                user,
                authenticated: user !== null,
                setUser,
                loadingAuthState
            }}>
                {children}
        </AuthContext.Provider>
    );
}