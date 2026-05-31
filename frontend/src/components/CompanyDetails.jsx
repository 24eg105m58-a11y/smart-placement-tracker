import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import PageHeader from "./ui/PageHeader";
import { FormField, inputClass, selectClass, textareaClass, FormActions } from "./ui/FormField";
import { getFullName } from "../utils/userSession";

const emptyForm = {
  companyName: "",
  companyEmail: "",
  companyWebsite: "",
  companyLocation: "",
  companyType: "",
  companyDescription: "",
  hrName: "",
  hrPhone: "",
  hrLinkedIn: "",
  companyLogo: null,
  companyLogoUrl: "",
};

const CompanyDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileRes, companyRes] = await Promise.all([
        api.get("/user-api/profile"),
        api.get("/company-api/get-companyDetails"),
      ]);

      const profile = profileRes.data.payload;
      const company = companyRes.data.payload;
      const fullName = getFullName(profile);

      if (company) {
        setIsEdit(true);
        setFormData({
          companyName: company.companyName || profile.companyName || "",
          companyEmail: company.companyEmail || profile.email || "",
          companyWebsite: company.companyWebsite || "",
          companyLocation: company.companyLocation || "",
          companyType: company.companyType || "",
          companyDescription: company.companyDescription || "",
          hrName: company.hrName || fullName,
          hrPhone: company.hrPhone || "",
          hrLinkedIn: company.hrLinkedIn || "",
          companyLogo: null,
          companyLogoUrl: company.companyLogo || "",
        });
      } else {
        setFormData({
          ...emptyForm,
          companyName: profile.companyName || localStorage.getItem("companyName") || "",
          companyEmail: profile.email || "",
          hrName: fullName,
        });
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to load company details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "companyLogo" && value) {
          payload.append("companyLogo", value);
          return;
        }
        if (key !== "companyLogo" && key !== "companyLogoUrl" && value !== null && value !== undefined) {
          payload.append(key, value);
        }
      });

      const response = isEdit
        ? await api.put("/company-api/companyDetails", payload)
        : await api.post("/company-api/companyDetails", payload);

      toast.success(response.data.message || "Company details saved");
      if (formData.companyName) {
        localStorage.setItem("companyName", formData.companyName);
      }
      navigate("/recruiter/recruiter-dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">Loading company details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.75fr] gap-6">
          <div>
            <PageHeader
              title="Company Details"
              subtitle={isEdit ? "Update your company profile" : "Complete your company profile to start posting jobs"}
            />

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              <FormField label="Company Logo" fullWidth>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                    {formData.companyLogo ? (
                      <img
                        src={URL.createObjectURL(formData.companyLogo)}
                        alt="Company logo preview"
                        className="w-full h-full object-cover"
                      />
                    ) : formData.companyLogoUrl ? (
                      <img
                        src={formData.companyLogoUrl}
                        alt="Company logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">Logo</span>
                    )}
                  </div>
                  <input
                    type="file"
                    name="companyLogo"
                    accept="image/*"
                    onChange={handleChange}
                    className="block w-full text-sm text-gray-600 file:mr-4 file:px-4 file:py-2 file:border-0 file:bg-blue-600 file:text-white file:rounded-xl hover:file:bg-blue-700"
                  />
                </div>
              </FormField>

              <FormField label="Company Name">
                <input
                  className={inputClass}
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </FormField>

              <FormField label="Company Email">
                <input
                  type="email"
                  className={inputClass}
                  name="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleChange}
                  required
                />
              </FormField>

              <FormField label="Company Website">
                <input
                  type="url"
                  className={inputClass}
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                  placeholder="https://company.com"
                  required
                />
              </FormField>

              <FormField label="Location">
                <input
                  className={inputClass}
                  name="companyLocation"
                  value={formData.companyLocation}
                  onChange={handleChange}
                  required
                />
              </FormField>

              <FormField label="Company Type">
                <select
                  className={selectClass}
                  name="companyType"
                  value={formData.companyType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select company type</option>
                  <option value="Product Based">Product Based</option>
                  <option value="Service Based">Service Based</option>
                  <option value="Startup">Startup</option>
                  <option value="MNC">MNC</option>
                  <option value="Government">Government</option>
                </select>
              </FormField>

              <FormField label="HR Name">
                <input
                  className={inputClass}
                  name="hrName"
                  value={formData.hrName}
                  onChange={handleChange}
                  required
                />
              </FormField>

              <FormField label="HR Phone">
                <input
                  className={inputClass}
                  name="hrPhone"
                  value={formData.hrPhone}
                  onChange={handleChange}
                  required
                />
              </FormField>

              <FormField label="HR LinkedIn">
                <input
                  type="url"
                  className={inputClass}
                  name="hrLinkedIn"
                  value={formData.hrLinkedIn}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/..."
                />
              </FormField>

              <FormField label="Description" fullWidth>
                <textarea
                  rows={4}
                  className={textareaClass}
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleChange}
                  placeholder="Describe your company (minimum 20 characters)"
                  minLength={20}
                  required
                />
              </FormField>

              <FormActions
                onCancel={() => navigate("/recruiter/recruiter-dashboard")}
                submitLabel={saving ? "Saving..." : isEdit ? "Update Company Details" : "Save Company Details"}
              />
            </form>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-base font-semibold text-gray-900">Preview</h3>
              <div className="mt-4 flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center">
                  {formData.companyLogo ? (
                    <img
                      src={URL.createObjectURL(formData.companyLogo)}
                      alt="Company logo preview"
                      className="w-full h-full object-cover"
                    />
                  ) : formData.companyLogoUrl ? (
                    <img src={formData.companyLogoUrl} alt="Company logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-gray-400">Logo</span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{formData.companyName || "Company Name"}</p>
                  <p className="text-sm text-gray-500">{formData.companyType || "Company Type"}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-base font-semibold text-gray-900">HR Contact</h3>
              <div className="mt-3 space-y-2 text-sm text-gray-600">
                <p>{formData.hrName || "HR Name"}</p>
                <p>{formData.hrPhone || "HR Phone"}</p>
                <p className="break-all">{formData.hrLinkedIn || "HR LinkedIn"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
