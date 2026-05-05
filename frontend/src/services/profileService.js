import API from "./api";


// Update user profile

export const updateUserProfile = async (userId, formData) => {
  try {
    const response = await API.put(`/users/${userId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("API updateUserProfile error:", error);
    throw error;
  }
};



// Fetch user profile
export const getUserProfile = async (userId) => {
  try {
    const response = await API.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("API getUserProfile error:", error);
    throw error;
  }
};

