"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from "../../utils/api";

interface Job {
    _id: string;
    title: string;
    description: string;
    location: string;
    jobType: string;
}

export default function JobDetailPage() {
    const params = useParams();
    const jobId = params.id;
    const [job, setJob] = useState < Job | null > (null);
    const [coverLetter, setCoverLetter] = useState("");
    const [resume, setResume] = useState < File | null > (null);

    useEffect(() => {
        api.get(`/jobs/${jobId}`).then(res => setJob(res.data));
    }, [jobId]);

    const handleApply = async () => {
        if (!resume) return alert("Upload resume");
        const formData = new FormData();
        formData.append("coverLetter", coverLetter);
        formData.append("resume", resume);

        await api.post(`/applications/${jobId}/apply`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Applied successfully!");
    };

    if (!job) return <div>Loading...</div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <p>{job.location} | {job.jobType}</p>
            <p>{job.description}</p>
            <textarea placeholder="Cover Letter" value={coverLetter} onChange={e => setCoverLetter(e.target.value)} className="border p-2 w-full mt-2" />
            <input type="file" onChange={e => setResume(e.target.files![0])} className="mt-2" />
            <button onClick={handleApply} className="bg-blue-500 text-white px-4 py-2 mt-2">Apply</button>
        </div>
    );
}
