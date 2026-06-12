import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/client";

const InterviewJobDetails = () => {
  const { jobId } = useParams();

  const [job, setJob] = useState(null);

  useEffect(() => {
    api
      .get(`/job-postings/${jobId}`)
      .then((res) => {
        setJob(res.data.payload);
      })
      .catch(console.error);
  }, [jobId]);

  if (!job) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h1 className="text-2xl font-bold">{job.jobRole}</h1>

      <div className="mt-4 space-y-3">
        <p>
          <strong>Company:</strong> {job.companyName}
        </p>

        <p>
          <strong>Package:</strong> {job.package}
        </p>

        <p>
          <strong>Location:</strong> {job.location}
        </p>

        <p>
          <strong>Minimum CGPA:</strong> {job.minimumCGPA}
        </p>

        <p>
          <strong>Drive Date:</strong>{" "}
          {new Date(job.driveDate).toLocaleDateString()}
        </p>

        <p>
          <strong>Description:</strong>
        </p>

        <div className="bg-gray-50 p-4 rounded-xl">{job.description}</div>
      </div>
    </div>
  );
};

export default InterviewJobDetails;
