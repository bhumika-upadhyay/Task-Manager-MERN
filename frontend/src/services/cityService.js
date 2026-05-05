import API from "./api";

const CityService = {
  // GET cities (with optional state filter)
  getCities: async (state) => {
    try {
      const url = state
        ? `/cities?state=${encodeURIComponent(state)}`
        : "/cities";

      const res = await API.get(url);
      return res.data || [];
    } catch (err) {
      console.error("Error fetching cities:", err);
      throw err.response?.data?.msg || "Failed to fetch cities";
    }
  },

  // CREATE city
  createCity: async (city) => {
    try {
      const { name, state, zipCodes } = city;

      if (!name || !state) {
        throw new Error("City name and state are required");
      }

      const res = await API.post("/cities", {
        name,
        state,
        zipCodes: zipCodes || [],
      });

      return res.data;
    } catch (err) {
      console.error("Error creating city:", err);
      throw err.response?.data?.msg || err.message;
    }
  },

  // UPDATE city
  updateCity: async (id, city) => {
    try {
      if (!id) throw new Error("City ID is required");

      const res = await API.put(`/cities/${id}`, city);
      return res.data;
    } catch (err) {
      console.error("Error updating city:", err);
      throw err.response?.data?.msg || err.message;
    }
  },

  // DELETE city
  deleteCity: async (id) => {
    try {
      if (!id) throw new Error("City ID is required");

      const res = await API.delete(`/cities/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error deleting city:", err);
      throw err.response?.data?.msg || err.message;
    }
  },
};

export default CityService;
