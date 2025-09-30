"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../../utils/api";
import { useAppContext } from "@/components/AppContectTheme";

type Job = {
    _id: string;
    title: string;
    description: string;
    location: string;
    jobType: string;
    salary: string;
};

type FilterForm = {
    q: string;
    location: string;
    jobType: string;
};

type ApplyForm = {
    resume: FileList;
    coverLetter?: string;
};

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    const { darkMode, role } = useAppContext();

    const { register, handleSubmit } = useForm<FilterForm>();
    const { register: registerApply, handleSubmit: handleApplySubmit, reset } = useForm<ApplyForm>();

    const fetchJobs = async (filters?: FilterForm) => {
        try {
            const params: any = {};
            if (filters?.q) params.q = filters.q;
            if (filters?.location) params.location = filters.location;
            if (filters?.jobType) params.jobType = filters.jobType;
            const res = await api.get("/jobs", { params });
            setJobs(res.data.jobs);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const openModal = (job: Job) => {
        setSelectedJob(job);
        setModalOpen(true);
        reset();
    };

    const closeModal = () => {
        setSelectedJob(null);
        setModalOpen(false);
    };

    const onApply = async (data: ApplyForm) => {
        if (!selectedJob) return;
        try {
            const formData = new FormData();
            if (data.resume?.[0]) formData.append("resume", data.resume[0]);
            if (data.coverLetter) formData.append("coverLetter", data.coverLetter);

            await api.post(`/applications/${selectedJob._id}/apply`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("Applied successfully!");
            closeModal();
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to apply");
        }
    };

    return (
        <div className={`space-y-6 ${!darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} p-4 min-h-screen`}>
            {/* Filter Form */}
            <form
                className={`flex flex-wrap gap-2 p-4 rounded shadow ${!darkMode ? "bg-gray-800" : "bg-white"
                    }`}
                onSubmit={handleSubmit(fetchJobs)}
            >
                <input
                    {...register("q")}
                    placeholder="Keyword"
                    className={`border p-2 rounded flex-1 min-w-[150px] ${!darkMode ? "bg-gray-700 text-white border-gray-600" : ""
                        }`}
                />
                <input
                    {...register("location")}
                    placeholder="Location"
                    className={`border p-2 rounded flex-1 min-w-[150px] ${!darkMode ? "bg-gray-700 text-white border-gray-600" : ""
                        }`}
                />
                <select
                    {...register("jobType")}
                    className={`border p-2 rounded flex-1 min-w-[150px] ${!darkMode ? "bg-gray-700 text-white border-gray-600" : ""
                        }`}
                >
                    <option value="">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Remote">Remote</option>
                </select>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Filter
                </button>
            </form>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {jobs.length === 0 && <p className="col-span-4 text-center">No jobs found.</p>}
                {jobs.map((job) => (
                    <div
                        key={job._id}
                        className={`p-6 rounded-lg shadow hover:shadow-lg transition flex flex-col justify-between ${!darkMode ? "bg-gray-800" : "bg-white"
                            }`}
                    >
                        <div>
                            <h2 className="font-bold text-lg mb-2">{job.title}</h2>
                            <p className={`mb-2 ${!darkMode ? "text-gray-300" : "text-gray-600"}`}>{job.description}</p>
                            <p className={`text-sm ${!darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                {job.location} | {job.jobType} | {job.salary}
                            </p>
                        </div>
                        <button
                            onClick={() => openModal(job)}
                            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition self-start"
                        >
                            Apply
                        </button>
                    </div>
                ))}
            </div>

            {/* Apply Modal */}
            {modalOpen && selectedJob && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className={`p-6 rounded shadow-lg w-full max-w-md relative ${!darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
                        <h2 className="text-xl font-bold mb-4">Apply for {selectedJob.title}</h2>
                        <form onSubmit={handleApplySubmit(onApply)} className="space-y-4">
                            <input
                                type="file"
                                {...registerApply("resume")}
                                className={`w-full border p-2 rounded ${!darkMode ? "bg-gray-700 text-white border-gray-600" : ""}`}
                                required
                            />
                            <textarea
                                {...registerApply("coverLetter")}
                                placeholder="Cover Letter (optional)"
                                className={`w-full border p-2 rounded ${!darkMode ? "bg-gray-700 text-white border-gray-600" : ""}`}
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className={`px-4 py-2 rounded ${!darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-300 hover:bg-gray-400"
                                        }`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
