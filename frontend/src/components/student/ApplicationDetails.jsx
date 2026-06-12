import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/client";

const ApplicationDetails = () => {
  const { applicationId } = useParams();

  const [application, setApplication] = useState(null);

  useEffect(() => {
    api
      .get(`/applications/${applicationId}`)
      .then((res) => {
        setApplication(res.data.payload);
      })
      .catch(console.error);
  }, [applicationId]);

  if (!application) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h1 className="text-2xl font-bold">Application Details</h1>

      <div className="mt-5 space-y-3">
        <p>
          <strong>Company:</strong> {application.companyName}
        </p>

        <p>
          <strong>Role:</strong> {application.jobRole}
        </p>

        <p>
          <strong>Status:</strong> {application.status}
        </p>

        <p>
          <strong>Applied On:</strong>{" "}
          {new Date(application.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default ApplicationDetails;
