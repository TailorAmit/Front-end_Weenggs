"use client";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useAppContext } from "@/components/AppContectTheme";

type DashboardStats = {
    totalJobs: number;
    totalApplications: number;
};

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        totalJobs: 0,
        totalApplications: 0,
    });
    const [loading, setLoading] = useState(true);

    const { role, darkMode } = useAppContext(); // ✅ role + theme

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // company/admin: jobs, candidate: applications
                if (role === "company" || role === "admin") {
                    const jobsRes = await api.get("/jobs/my-jobs");
                    setStats((prev) => ({
                        ...prev,
                        totalJobs: jobsRes.data.total || jobsRes.data.jobs?.length || 0,
                    }));
                }
                if (role === "candidate" || role === "admin") {
                    const appsRes = await api.get("/applications/me");
                    setStats((prev) => ({
                        ...prev,
                        totalApplications: appsRes.data.length || 0,
                    }));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [role]);

    if (loading) {
        return <p className="p-4 text-center">Loading...</p>;
    }

    return (
        <div
            className={`p-6 min-h-screen ${!darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
                }`}
        >
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {(role === "company" || role === "admin") && (
                    <div
                        className={`p-6 rounded-xl shadow flex flex-col items-center justify-center ${!darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                            }`}
                    >
                        <p className="text-gray-500 dark:text-gray-300">Total Jobs Posted</p>
                        <p className="text-4xl font-bold">{stats.totalJobs}</p>
                    </div>
                )}

                {(role === "candidate" || role === "admin") && (
                    <div
                        className={`p-6 rounded-xl shadow flex flex-col items-center justify-center ${!darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                            }`}
                    >
                        <p className="text-gray-500 dark:text-gray-300">Total Applications</p>
                        <p className="text-4xl font-bold">{stats.totalApplications}</p>
                    </div>
                )}
            </div>

            <div
                className={`mt-8 p-6 rounded-xl shadow ${!darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                    }`}
            >
                <p>
                    {role === "company" &&
                        "Welcome to your dashboard! Use the sidebar to post new jobs or view applicants."}
                    {role === "candidate" &&
                        "Welcome to your dashboard! Use the sidebar to explore jobs and track your applications."}
                    {role === "admin" &&
                        "Welcome Admin! You can view company and candidate stats."}
                </p>
            </div>
        </div>
    );
}
