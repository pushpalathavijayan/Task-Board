// utils/auth.js
// Helper functions for storing / retrieving auth info from localStorage

export const saveToken = (token) => {
  if (!token) return;
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const saveUser = (userObj) => {
  if (!userObj) return;
  localStorage.setItem("tb_user", JSON.stringify(userObj));
};

export const getUser = () => {
  try {
    const data = localStorage.getItem("tb_user");
    if (!data) return null; // <--- prevents JSON.parse null error
    return JSON.parse(data);
  } catch (err) {
    console.error("Error parsing user:", err);
    return null;
  }
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("tb_user");
};
