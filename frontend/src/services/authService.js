import API from "./api";

// REGISTER
export const registerUser = async (userData) => {
  const res = await API.post("/auth/register", userData); // include /users
  return res.data;
};

// LOGIN
export const loginUser = async (loginData) => {
  const res = await API.post("/auth/login", loginData);
  return res.data;
};

// FORGOT PASSWORD
export const forgetPassword = async (email) => {
  const res = await API.post("/users/forgot-password", { email });
  return res.data;
};

// RESET PASSWORD
export const resetPassword = async (token, password) => {
  const res = await API.post(`/users/reset-password/${token}`, { password });
  return res.data;
};
// 🔥 LOGOUT (ADD THIS)
export const logoutUser = async () => {
  try {
    // optional backend call
    await API.post("/auth/logout");

    // 🔥 MAIN LOGOUT
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return { success: true };

  } catch (error) {
    console.error("Logout error:", error);

    // even if API fails, logout anyway
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return { success: false };
  }
};