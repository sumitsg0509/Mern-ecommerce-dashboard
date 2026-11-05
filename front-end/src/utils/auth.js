// Central helpers for reading/writing auth state
// (kept in one place so every component uses the same logic)

export const getToken = () => {
  const stored = localStorage.getItem("token");

  if (!stored) {
    return null;
  }

  // Support tokens saved both as raw strings and as JSON strings
  try {
    const parsed = JSON.parse(stored);
    return typeof parsed === "string" ? parsed : stored;
  } catch {
    return stored;
  }
};

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const saveAuth = ({ token, user }) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const isAuthenticated = () => Boolean(getToken() && getStoredUser());
