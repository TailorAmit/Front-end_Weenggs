import Link from "next/link";

interface JobCardProps {
    job: {
        _id: string;
        title: string;
        location: string;
        jobType: string;
        description: string;
    };
}

export default function JobCard({ job }: JobCardProps) {
    return (
        <div className="border p-4 rounded shadow hover:shadow-lg">
            <h2 className="font-bold text-lg">{job.title}</h2>
            <p>{job.location} | {job.jobType}</p>
            <p className="text-gray-600">{job.description.slice(0, 100)}...</p>
            <Link href={`/jobs/${job._id}`} className="text-blue-500 mt-2 inline-block">View & Apply</Link>
        </div>
    );
}
