"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Home,
    Briefcase,
    Users,
    LogOut,
    Search,
    FileText,
    ChevronLeft,
    ChevronRight,
    Sun,
    Moon,
} from "lucide-react";
import { useAppContext } from "../../components/AppContectTheme";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const [open, setOpen] = useState(true);
    const { role, darkMode, toggleDarkMode } = useAppContext();

    console.log("darkMode", darkMode)
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        router.push("/login");
    };

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
            {/* Sidebar */}
            <aside
                className={`${darkMode
                    ? "bg-white text-gray-900" // override for darkMode ON
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    } p-4 flex flex-col justify-between transition-all duration-300 ${open ? "w-64" : "w-20"}`}
            >

                <div>
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-8">
                        <img
                            src="https://img.icons8.com/ios-filled/50/000000/job.png"
                            alt="Logo"
                            className={`w-8 h-8 transition-all duration-300 ${open ? "block" : "hidden"}`}
                        />
                        {open && <span className="text-xl font-bold">JobBoard</span>}
                    </div>

                    {/* Menu */}
                    <nav className="flex flex-col gap-2">
                        {(role === "admin" || role === "company") && (
                            <>
                                <Link href="/dashboard" className={`flex items-center gap-3 p-2 rounded transition-colors
        ${darkMode
                                        ? "hover:bg-gray-100"   // lighter hover for white sidebar in dark mode
                                        : "hover:bg-gray-200 dark:hover:bg-gray-700"
                                    }`}>
                                    <Home className="w-5 h-5" /> {open && <span>Dashboard</span>}
                                </Link>
                                <Link href="/dashboard/post-job" className={`flex items-center gap-3 p-2 rounded transition-colors
        ${darkMode
                                        ? "hover:bg-gray-100"   // lighter hover for white sidebar in dark mode
                                        : "hover:bg-gray-200 dark:hover:bg-gray-700"
                                    }`}>
                                    <Briefcase className="w-5 h-5" /> {open && <span>Post New Job</span>}
                                </Link>
                                <Link href="/dashboard/applicants" className={`flex items-center gap-3 p-2 rounded transition-colors
        ${darkMode
                                        ? "hover:bg-gray-100"   // lighter hover for white sidebar in dark mode
                                        : "hover:bg-gray-200 dark:hover:bg-gray-700"
                                    }`}>
                                    <Users className="w-5 h-5" /> {open && <span>View Applicants</span>}
                                </Link>
                            </>
                        )}

                        {role === "user" && (
                            <>
                                <Link href="/dashboard/jobs" className={`flex items-center gap-3 p-2 rounded transition-colors
        ${darkMode
                                        ? "hover:bg-gray-100"   // lighter hover for white sidebar in dark mode
                                        : "hover:bg-gray-200 dark:hover:bg-gray-700"
                                    }`}>
                                    <Search className="w-5 h-5" /> {open && <span>Job Listings</span>}
                                </Link>
                                <Link href="/dashboard/applied" className={`flex items-center gap-3 p-2 rounded transition-colors
        ${darkMode
                                        ? "hover:bg-gray-100"   // lighter hover for white sidebar in dark mode
                                        : "hover:bg-gray-200 dark:hover:bg-gray-700"
                                    }`}>
                                    <FileText className="w-5 h-5" /> {open && <span>My Applications</span>}
                                </Link>
                            </>
                        )}

                        {!role && <p className="text-gray-400 p-2">Loading menu...</p>}
                    </nav>
                </div>

                {/* Bottom Actions */}
                <div className="flex flex-col gap-2">
                    {/* Theme toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className={`flex items-center gap-3 p-2 rounded transition-colors
        ${darkMode
                                ? "hover:bg-gray-100"   // lighter hover for white sidebar in dark mode
                                : "hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                    >
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        {open && <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>}
                    </button>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 p-2 rounded hover:bg-red-500 hover:text-white transition-colors"
                    >
                        <LogOut className="w-5 h-5" /> {open && <span>Logout</span>}
                    </button>

                    {/* Sidebar toggle */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center justify-center mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        {open ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main
                className={`flex-1 p-6 overflow-auto transition-colors ${!darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
                    }`}
            >
                {children}
            </main>
        </div >
    );
}
