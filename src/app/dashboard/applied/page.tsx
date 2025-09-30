"use client";

import { useEffect, useState } from "react";
import api, { baseURLAssets } from "../../../utils/api";
import { useAppContext } from "@/components/AppContectTheme";

type Application = {
    _id: string;
    job: {
        title: string;
        location: string;
        jobType: string;
        salary: string;
    };
    resume: string;
};

export default function AppliedPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const { role, darkMode } = useAppContext(); // ✅ use context

    const fetchApplications = async () => {
        try {
            const res = await api.get("/applications/me");
            setApplications(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    // 🔒 Restrict to user role only
    if (role !== "user") {
        return (
            <div
                className={`p-6 rounded ${!darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
                    }`}
            >
                <p>Only users can view their applications.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h1
                className={`text-2xl font-bold ${!darkMode ? "text-gray-100" : "text-gray-900"
                    }`}
            >
                My Applications
            </h1>

            {applications.length === 0 && (
                <p className={!darkMode ? "text-gray-300" : "text-gray-600"}>
                    You have not applied to any jobs yet.
                </p>
            )}

            {applications.map((app) => (
                <div
                    key={app._id}
                    className={`p-4 rounded shadow flex justify-between items-center transition-colors ${!darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
                        }`}
                >
                    <div>
                        <h2
                            className={`font-bold text-lg ${!darkMode ? "text-gray-100" : "text-gray-900"
                                }`}
                        >
                            {app.job.title}
                        </h2>
                        <p className={!darkMode ? "text-gray-300" : "text-gray-700"}>
                            {app.job.location} | {app.job.jobType} | {app.job.salary}
                        </p>
                    </div>
                    <a
                        href={`${baseURLAssets}/${app.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                    >
                        View Resume
                    </a>
                </div>
            ))}
        </div>
    );
}
