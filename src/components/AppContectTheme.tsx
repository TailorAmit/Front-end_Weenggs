"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AppContextType {
    role: string | null;
    setRole: (role: string | null) => void;
    darkMode: boolean;
    toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [role, setRole] = useState<string | null>(null);
    const [darkMode, setDarkMode] = useState<boolean>(false);

    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        setRole(storedRole);

        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "dark") {
            setDarkMode(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    const toggleDarkMode = () => {
        setDarkMode((prev) => {
            const newMode = !prev;
            if (newMode) {
                document.documentElement.classList.add("dark");
                localStorage.setItem("theme", "dark");
            } else {
                document.documentElement.classList.remove("dark");
                localStorage.setItem("theme", "light");
            }
            return newMode;
        });
    };

    return (
        <AppContext.Provider value={{ role, setRole, darkMode, toggleDarkMode }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useAppContext must be used within AppProvider");
    return context;
};
