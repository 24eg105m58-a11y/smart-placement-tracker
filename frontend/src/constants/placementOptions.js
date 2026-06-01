export const branchOptions = [
  { value: "CSE", label: "Computer Science Engineering (CSE)" },
  { value: "CSM", label: "Computer Science & AI/ML (CSM)" },
  { value: "CSD", label: "Computer Science & Data Science (CSD)" },
  { value: "CSC", label: "Computer Science & Cyber Security (CSC)" },
  { value: "IT", label: "Information Technology (IT)" },
  { value: "ECE", label: "Electronics & Communication Engineering (ECE)" },
  { value: "EEE", label: "Electrical & Electronics Engineering (EEE)" },
  { value: "MECH", label: "Mechanical Engineering" },
  { value: "CIVIL", label: "Civil Engineering" },
  { value: "CHEM", label: "Chemical Engineering" },
  { value: "AERO", label: "Aeronautical Engineering" },
  { value: "AUTO", label: "Automobile Engineering" },
  { value: "MINING", label: "Mining Engineering" },
  { value: "BIOTECH", label: "Biotechnology Engineering" },
  { value: "AGRI", label: "Agricultural Engineering" },
  { value: "PETRO", label: "Petroleum Engineering" },
  { value: "METALLURGY", label: "Metallurgical Engineering" },
  { value: "TEXTILE", label: "Textile Engineering" },
];

export const branches = branchOptions.map((branch) => branch.value);

export const jobBranchOptions = [
  { value: "ANY", label: "Any Branch" },
  ...branchOptions,
];

export const batches = ["2024", "2025", "2026", "2027"];

export const institutionSettings = {
  institutionName: "Smart Placement College",
  contactEmail: "tpo@college.edu",
  contactPhone: "+91 40 12345678",
  address: "123 University Road, Hyderabad, Telangana 500001",
};
