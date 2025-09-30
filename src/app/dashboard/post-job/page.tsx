"use client";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import { Job } from "./types";
import JobModal from "./JobModal";
import { useAppContext } from "@/components/AppContectTheme";

export default function PostJobPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editJob, setEditJob] = useState<Job | null>(null);

    const { role, darkMode } = useAppContext(); // ✅ role + theme

    const fetchJobs = async () => {
        try {
            const res = await api.get("/jobs/my-jobs");
            setJobs(res.data.jobs || res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleSubmit = async (data: any) => {
        try {
            if (editJob) {
                await api.put(`/jobs/${editJob._id}`, data);
                alert("Job updated successfully!");
            } else {
                await api.post("/jobs", data);
                alert("Job posted successfully!");
            }
            setModalOpen(false);
            setEditJob(null);
            fetchJobs();
        } catch (err) {
            alert("Failed to save job");
        }
    };

    const handleEdit = (job: Job) => {
        setEditJob(job);
        setModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this job?")) return;
        try {
            await api.delete(`/jobs/${id}`);
            fetchJobs();
        } catch (err) {
            alert("Failed to delete job");
        }
    };

    // 🚫 Restrict: only company/admin can post jobs
    if (role !== "company" && role !== "admin") {
        return (
            <div
                className={`p-6 rounded-lg shadow ${!darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                    }`}
            >
                <h2 className="text-xl font-bold mb-2">Unauthorized</h2>
                <p>You do not have permission to post jobs.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4">
            <button
                onClick={() => setModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded justify-self-end hover:bg-blue-600"
            >
                Post New Job
            </button>

            <JobModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditJob(null);
                }}
                onSubmit={handleSubmit}
                initialData={editJob || undefined}
            />

            <div
                className={`mx-auto p-4 rounded-lg shadow overflow-x-auto ${!darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                    }`}
            >
                <h2 className="text-xl font-bold mb-4">My Jobs</h2>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2">Title</th>
                            <th className="p-2">Location</th>
                            <th className="p-2">Type</th>
                            <th className="p-2">Salary</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((job) => (
                            <tr
                                key={job._id}
                                className={`border-b ${!darkMode
                                    ? "hover:bg-gray-700"
                                    : "hover:bg-gray-100"
                                    }`}
                            >
                                <td className="p-2">{job.title}</td>
                                <td className="p-2">{job.location}</td>
                                <td className="p-2">{job.jobType}</td>
                                <td className="p-2">{job.salary}</td>
                                <td className="p-2 flex gap-2">
                                    <button
                                        onClick={() => handleEdit(job)}
                                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(job._id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {jobs.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-300 mt-2">
                        No jobs posted yet.
                    </p>
                )}
            </div>
        </div>
    );
}
