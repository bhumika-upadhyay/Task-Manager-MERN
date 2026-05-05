import API from "./api";

const CountryService = {
  getCountries: async () => {
    try {
      const res = await API.get("/country");
      return res.data?.countries || [];
    } catch (err) {
      console.error("Get countries error:", err);
      throw err.response?.data?.msg || "Failed to fetch countries";
    }
  },

  createCountry: async (countryName) => {
    try {
      const res = await API.post("/country", { countryName });
      return res.data;
    } catch (err) {
      console.error("Create country error:", err);
      throw err.response?.data?.msg || "Failed to create country";
    }
  },

  updateCountry: async (id, countryName) => {
    try {
      const res = await API.put(`/country/${id}`, { countryName });
      return res.data;
    } catch (err) {
      console.error("Update country error:", err);
      throw err.response?.data?.msg || "Failed to update country";
    }
  },

  deleteCountry: async (id) => {
    try {
      const res = await API.delete(`/country/${id}`);
      return res.data;
    } catch (err) {
      console.error("Delete country error:", err);
      throw err.response?.data?.msg || "Failed to delete country";
    }
  },
};

export default CountryService;


