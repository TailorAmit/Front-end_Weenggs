"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        const saved = localStorage.getItem("theme") as "light" | "dark" | null;
        if (saved) {
            document.documentElement.setAttribute("data-theme", saved);
            setTheme(saved);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        setTheme(newTheme);
    };

    return (
        <nav className="bg-gray-100 dark:bg-gray-800 p-4 flex justify-between">
            <Link href="/" className="font-bold">Job Board</Link>
            <div className="space-x-4">
                <Link href="/login">Login</Link>
                <Link href="/register">Register</Link>
                <button onClick={toggleTheme} className="px-2 py-1 border rounded">
                    {theme === "light" ? "Dark Mode" : "Light Mode"}
                </button>
            </div>
        </nav>
    );
}
