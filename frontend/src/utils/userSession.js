export const getFullName = (user) => {
  if (!user) return "";
  const name = [user.firstname, user.lastname].filter(Boolean).join(" ").trim();
  return name;
};

export const storeUserSession = (user) => {
  if (!user) return;
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("role", user.role);
  const fullName = getFullName(user);
  if (fullName) localStorage.setItem("userName", fullName);
  if (user.companyName) localStorage.setItem("companyName", user.companyName);
};

export const clearUserSession = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("role");
  localStorage.removeItem("userName");
  localStorage.removeItem("companyName");
};
