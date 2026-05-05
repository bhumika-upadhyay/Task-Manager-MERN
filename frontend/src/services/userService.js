import API from "./api";

const isFormData = (value) => value instanceof FormData;

const appendIfDefined = (formData, key, value) => {
  if (value !== undefined && value !== null) {
    formData.append(key, value);
  }
};

const buildCreateUserFormData = (userData = {}) => {
  const formData = new FormData();

  appendIfDefined(formData, "firstname", userData.firstname || "");
  appendIfDefined(formData, "lastname", userData.lastname || "");
  appendIfDefined(formData, "email", userData.email || "");
  appendIfDefined(formData, "password", userData.password || "");
  appendIfDefined(formData, "address", userData.address || "");
  appendIfDefined(formData, "phone", userData.phone || "");
  appendIfDefined(formData, "country", userData.country || "");
  appendIfDefined(formData, "state", userData.state || "");
  appendIfDefined(formData, "city", userData.city || "");
  appendIfDefined(formData, "zip", userData.zip || "");
  appendIfDefined(formData, "status", userData.status || "active");

  if (userData.photo) {
    formData.append("photo", userData.photo);
  }

  return formData;
};

const buildUpdateUserFormData = (userData = {}) => {
  const formData = new FormData();

  if (userData.firstname !== undefined) formData.append("firstname", userData.firstname);
  if (userData.lastname !== undefined) formData.append("lastname", userData.lastname);
  if (userData.email !== undefined) formData.append("email", userData.email);
  if (userData.address !== undefined) formData.append("address", userData.address);
  if (userData.phone !== undefined) formData.append("phone", userData.phone);
  if (userData.country !== undefined) formData.append("country", userData.country);
  if (userData.state !== undefined) formData.append("state", userData.state);
  if (userData.city !== undefined) formData.append("city", userData.city);
  if (userData.zip !== undefined) formData.append("zip", userData.zip);
  if (userData.status !== undefined) formData.append("status", userData.status);

  // password only if user actually entered new password
  if (userData.password && userData.password.trim() !== "") {
    formData.append("password", userData.password);
  }

  // photo only if new photo selected
  if (userData.photo instanceof File || userData.photo instanceof Blob) {
    formData.append("photo", userData.photo);
  }

  return formData;
};

const UserService = {
  getUsers: async (params = {}) => {
    try {
      const res = await API.get("/users", { params });
      return res.data;
    } catch (err) {
      console.error("Error fetching users:", err);
      throw err.response?.data?.msg || "Failed to fetch users";
    }
  },

  getUserById: async (id) => {
    try {
      const res = await API.get(`/users/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching user:", err);
      throw err.response?.data?.msg || "Failed to fetch user";
    }
  },

  createUser: async (userData) => {
    try {
      const payload = isFormData(userData)
        ? userData
        : buildCreateUserFormData(userData);

      const res = await API.post("/users", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    } catch (err) {
      console.error("Error creating user:", err);
      console.error("Create user backend response:", err?.response?.data);
      throw err.response?.data?.msg || "Failed to create user";
    }
  },

  updateUser: async (id, userData) => {
    try {
      const payload = isFormData(userData)
        ? userData
        : buildUpdateUserFormData(userData);

      const res = await API.put(`/users/${id}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    } catch (err) {
      console.error("Error updating user:", err);
      console.error("Update user backend response:", err?.response?.data);
      throw err.response?.data?.msg || "Failed to update user";
    }
  },

  deleteUser: async (id) => {
    try {
      const res = await API.delete(`/users/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error deleting user:", err);
      throw err.response?.data?.msg || "Failed to delete user";
    }
  },
};

export default UserService;