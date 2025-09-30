"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Job } from "./types";
import { useAppContext } from "@/components/AppContectTheme";

type JobForm = {
    title: string;
    description: string;
    location: string;
    jobType: string;
    salary: string;
};

type JobModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: JobForm) => void;
    initialData?: Job;
};

export default function JobModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
}: JobModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<JobForm>();

    const { role, darkMode
    } = useAppContext();

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        } else {
            reset({
                title: "",
                description: "",
                location: "",
                jobType: "",
                salary: "",
            });
        }
    }, [initialData, reset]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
                className={`p-6 rounded-lg w-full max-w-lg shadow-lg ${!darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                    }`}
            >
                <h2 className="text-xl font-bold mb-4">
                    {initialData ? "Edit Job" : "Post New Job"}
                </h2>

                {/* Optional: show role info */}
                {role === "admin" && (
                    <p className="mb-3 text-sm text-blue-500">
                        Posting as Admin
                    </p>
                )}

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <input
                        {...register("title", { required: true })}
                        placeholder="Title"
                        className="w-full border p-2 rounded"
                    />
                    {errors.title && (
                        <span className="text-red-500">Title is required</span>
                    )}

                    <textarea
                        {...register("description", { required: true })}
                        placeholder="Description"
                        className="w-full border p-2 rounded"
                    />
                    {errors.description && (
                        <span className="text-red-500">Description is required</span>
                    )}

                    <input
                        {...register("location", { required: true })}
                        placeholder="Location"
                        className="w-full border p-2 rounded"
                    />
                    {errors.location && (
                        <span className="text-red-500">Location is required</span>
                    )}

                    <select
                        {...register("jobType", { required: true })}
                        className="w-full border p-2 rounded"
                    >
                        <option value="">Select Job Type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Remote">Remote</option>
                    </select>
                    {errors.jobType && (
                        <span className="text-red-500">Job Type is required</span>
                    )}

                    <input
                        {...register("salary", { required: true })}
                        placeholder="Salary"
                        className="w-full border p-2 rounded"
                    />
                    {errors.salary && (
                        <span className="text-red-500">Salary is required</span>
                    )}

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`px-4 py-2 rounded ${!darkMode
                                ? "bg-gray-700 hover:bg-gray-600"
                                : "bg-gray-300 hover:bg-gray-400"
                                }`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                            {initialData ? "Update" : "Post"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
