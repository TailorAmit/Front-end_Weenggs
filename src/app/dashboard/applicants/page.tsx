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
    const { role, darkMode } = useAppContext();


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

    // If not a user role, don’t show this page
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
                className={`text-2xl font-bold ${!darkMode ? "text-white" : "text-black"
                    }`}
            >
                My Applications
            </h1>

            {applications.length === 0 && (
                <p className={!darkMode ? "text-gray-300" : "text-black"}>
                    You have not applied to any jobs yet.
                </p>
            )}

            {applications.map((app) => (
                <div
                    key={app._id}
                    className={`p-4 rounded shadow flex justify-between items-center transition-colors ${!!darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                        }`}
                >
                    <div>
                        <h2
                            className={`font-bold text-lg ${!darkMode ? "text-white" : "text-black"
                                }`}
                        >
                            {app.job.title}
                        </h2>
                        <p className={!darkMode ? "text-gray-300" : "text-black"}>
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
