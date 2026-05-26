import React from "react";

const Settings = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div
        className="
        bg-white
        rounded-3xl
        p-8
        shadow
        space-y-6
        "
      >
        <div>
          <label className="block mb-2">Change Password</label>

          <input
            type="password"
            placeholder="New Password"
            className="
            w-full
            border
            rounded-xl
            p-3
            "
          />
        </div>

        <button
          className="
          bg-blue-600
          text-white
          px-5
          py-3
          rounded-xl
          "
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
