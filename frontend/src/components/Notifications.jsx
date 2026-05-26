import React from "react";

const Notifications = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>

      <div
        className="
        bg-white
        rounded-3xl
        shadow
        p-8
        space-y-4
        "
      >
        <div className="border-b pb-4">Interview scheduled</div>

        <div className="border-b pb-4">Resume shortlisted</div>

        <div>New drive added</div>
      </div>
    </div>
  );
};

export default Notifications;
