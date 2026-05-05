

import API from "./api";

const StateService = {
  // GET states (with optional country filter)
  getStates: async (country) => {
    try {
      const url = country
        ? `/states?country=${encodeURIComponent(country)}`
        : "/states";

      const res = await API.get(url);
      return res.data;
    } catch (err) {
      console.error("Get states error:", err);
      throw err.response?.data?.msg || "Failed to fetch states";
    }
  },

  // CREATE state
  createState: async (data) => {
    try {
      const res = await API.post("/states", data);
      return res.data;
    } catch (err) {
      console.error("Create state error:", err);
      throw err.response?.data?.msg || "Failed to create state";
    }
  },

  // UPDATE state
  updateState: async (id, data) => {
    try {
      const res = await API.put(`/states/${id}`, data);
      return res.data;
    } catch (err) {
      console.error("Update state error:", err);
      throw err.response?.data?.msg || "Failed to update state";
    }
  },

  // DELETE state
  deleteState: async (id) => {
    try {
      const res = await API.delete(`/states/${id}`);
      return res.data;
    } catch (err) {
      console.error("Delete state error:", err);
      throw err.response?.data?.msg || "Failed to delete state";
    }
  },
};

export default StateService;
