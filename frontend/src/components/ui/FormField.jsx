export const FormField = ({ label, children, className = "", fullWidth = false }) => (
  <div className={`${fullWidth ? "md:col-span-2" : ""} ${className}`}>
    {label && (
      <label className="block mb-1.5 text-sm font-semibold text-gray-700">{label}</label>
    )}
    {children}
  </div>
);

export const inputClass =
  "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow";

export const selectClass = `${inputClass} bg-white`;

export const textareaClass = `${inputClass} resize-none`;

export const FormActions = ({ onCancel, submitLabel = "Save" }) => (
  <div className="md:col-span-2 flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
    {onCancel && (
      <button
        type="button"
        onClick={onCancel}
        className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors"
      >
        Cancel
      </button>
    )}
    <button
      type="submit"
      className="px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm transition-colors"
    >
      {submitLabel}
    </button>
  </div>
);
