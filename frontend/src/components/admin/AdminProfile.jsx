import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../ui/PageHeader";
import { FormField, inputClass } from "../ui/FormField";
import api from "../../api/client";

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    email: "",
    profileImageUrl: "",
    profileImage: null,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/user-api/profile")
      .then((res) => {
        const user = res.data.payload || {};
        setProfile({
          firstname: user.firstname || "",
          lastname: user.lastname || "",
          email: user.email || "",
          profileImageUrl: user.profileImageUrl || "",
          profileImage: null,
        });
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("firstname", profile.firstname);
      formData.append("lastname", profile.lastname);
      formData.append("email", profile.email);
      if (profile.profileImage) {
        formData.append("profileImageUrl", profile.profileImage);
      }

      const response = await api.put("/user-api/profile", formData);
      const updated = response.data.payload || {};
      setProfile((prev) => ({
        ...prev,
        profileImageUrl: updated.profileImageUrl || prev.profileImageUrl,
        profileImage: null,
      }));
      toast.success(response.data.message || "Profile updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Profile" subtitle="Manage your account information" />

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 space-y-6"
      >
        <div className="flex flex-col items-center pb-6 border-b border-gray-100">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
            {profile.profileImageUrl ? (
              <img src={profile.profileImageUrl} alt="Admin" className="w-full h-full object-cover" />
            ) : (
              `${profile.firstname?.[0] || ""}${profile.lastname?.[0] || ""}`.toUpperCase() || "A"
            )}
          </div>
          <label className="mt-3 text-sm text-blue-600 hover:underline font-medium cursor-pointer">
            Change Photo
            <input
              type="file"
              accept="image/*"
              name="profileImage"
              onChange={handleChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="First Name">
            <input className={inputClass} name="firstname" value={profile.firstname} onChange={handleChange} />
          </FormField>
          <FormField label="Last Name">
            <input className={inputClass} name="lastname" value={profile.lastname} onChange={handleChange} />
          </FormField>
          <FormField label="Email Address" fullWidth>
            <input type="email" className={inputClass} name="email" value={profile.email} onChange={handleChange} />
          </FormField>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm"
            disabled={saving}
          >
            {saving ? "Saving..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;
