import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  Stack,
  CircularProgress,
  IconButton,
  MenuItem,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useParams, useNavigate } from "react-router-dom";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import axios from "axios";
import CountryService from "../services/countryService";
import StateService from "../services/stateService";
import CityService from "../services/cityService";

const API_URL = "http://localhost:5000/api/users";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    password: "",
    confirmPassword: "",
    status: "active",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    fetchUser();
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [id]);

  const normalizeArray = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.countries)) return res.countries;
    if (Array.isArray(res?.states)) return res.states;
    if (Array.isArray(res?.cities)) return res.cities;
    return [];
  };

  const getCountryValue = (item) => {
    if (typeof item === "string") return item;
    return item?.countryName || item?.name || item?.label || "";
  };

  const getStateValue = (item) => {
    if (typeof item === "string") return item;
    return item?.stateName || item?.name || item?.label || "";
  };

  const getCityValue = (item) => {
    if (typeof item === "string") return item;
    return item?.cityName || item?.name || item?.label || "";
  };

  const getUniqueOptions = (items, getValue) => {
    const map = new Map();

    items.forEach((item) => {
      const rawValue = getValue(item);
      const cleanValue = rawValue?.trim();

      if (!cleanValue) return;

      const key = cleanValue.toLowerCase();
      if (!map.has(key)) {
        map.set(key, item);
      }
    });

    return Array.from(map.values());
  };

  const uniqueCountries = useMemo(
    () => getUniqueOptions(countryOptions, getCountryValue),
    [countryOptions]
  );

  const uniqueStates = useMemo(
    () => getUniqueOptions(stateOptions, getStateValue),
    [stateOptions]
  );

  const uniqueCities = useMemo(
    () => getUniqueOptions(cityOptions, getCityValue),
    [cityOptions]
  );

  const loadCountries = async () => {
    try {
      const res = await CountryService.getCountries();
      setCountryOptions(normalizeArray(res));
    } catch (err) {
      console.error("Error fetching countries:", err);
      setCountryOptions([]);
    }
  };

  const loadStates = async (countryName) => {
    try {
      const res = await StateService.getStates(countryName);
      setStateOptions(normalizeArray(res));
    } catch (err) {
      console.error("Error fetching states:", err);
      setStateOptions([]);
    }
  };

  const loadCities = async (stateName) => {
    try {
      const res = await CityService.getCities(stateName);
      setCityOptions(normalizeArray(res));
    } catch (err) {
      console.error("Error fetching cities:", err);
      setCityOptions([]);
    }
  };

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/${id}`);
      const data = res.data?.user || res.data || {};

      const fetchedUser = {
        firstname: data.firstname || "",
        lastname: data.lastname || "",
        email: data.email || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        country: data.country || "",
        zip: data.zip || "",
        password: "",
        confirmPassword: "",
        status: data.status || "active",
      };

      setUser(fetchedUser);

      setPreview(
        data.photo || data.profileImage || data.profile || data.avatar || ""
      );

      if (fetchedUser.country) {
        const stateRes = await StateService.getStates(fetchedUser.country);
        setStateOptions(normalizeArray(stateRes));
      }

      if (fetchedUser.state) {
        const cityRes = await CityService.getCities(fetchedUser.state);
        setCityOptions(normalizeArray(cityRes));
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
      alert(err?.response?.data?.msg || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "country") {
      setUser((prev) => ({
        ...prev,
        country: value,
        state: "",
        city: "",
      }));
      setCityOptions([]);
      if (value) {
        await loadStates(value);
      } else {
        setStateOptions([]);
      }
      return;
    }

    if (name === "state") {
      setUser((prev) => ({
        ...prev,
        state: value,
        city: "",
      }));
      if (value) {
        await loadCities(value);
      } else {
        setCityOptions([]);
      }
      return;
    }

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const validateForm = () => {
    if (
      !user.firstname.trim() ||
      !user.lastname.trim() ||
      !user.email.trim() ||
      !user.address.trim() ||
      !user.country.trim() ||
      !user.state.trim() ||
      !user.city.trim() ||
      !user.zip.trim()
    ) {
      alert("Please fill all required fields");
      return false;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(user.email.trim())) {
      alert("Please enter a valid email");
      return false;
    }

    if (user.password.trim() && user.password !== user.confirmPassword) {
      alert("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("firstname", user.firstname.trim());
      formData.append("lastname", user.lastname.trim());
      formData.append("email", user.email.trim());
      formData.append("address", user.address.trim());
      formData.append("country", user.country.trim());
      formData.append("state", user.state.trim());
      formData.append("city", user.city.trim());
      formData.append("zip", user.zip.trim());
      formData.append("status", user.status);

      if (user.password.trim()) {
        formData.append("password", user.password.trim());
      }

      if (file) {
        formData.append("photo", file);
      }

      await axios.put(`${API_URL}/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("User updated successfully!");
      navigate("/dashboard/userspage");
    } catch (err) {
      console.error("Failed to update user:", err);
      console.error("Backend response:", err?.response?.data);
      alert(err?.response?.data?.msg || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: { xs: 1.5, sm: 2, md: 3 },
        py: { xs: 2, sm: 3 },
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 520,
          borderRadius: 3,
          px: { xs: 2, sm: 3 },
          py: { xs: 2.5, sm: 3 },
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={700}>
            Edit User
          </Typography>

          <Stack alignItems="center" spacing={1}>
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={preview || ""}
                sx={{
                  width: 76,
                  height: 76,
                  bgcolor: "#e8e8ee",
                }}
              >
                {!preview && (
                  <PhotoCameraIcon sx={{ color: "#000", fontSize: 34 }} />
                )}
              </Avatar>

              <IconButton
                component="label"
                sx={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0,
                  cursor: "pointer",
                }}
              >
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </IconButton>
            </Box>

            <Button
              component="label"
              size="small"
              sx={{
                minWidth: "auto",
                px: 1.2,
                py: 0.3,
                fontSize: "0.75rem",
                lineHeight: 1.2,
                textTransform: "none",
                color: "#8e63c9",
                backgroundColor: "#eee5fb",
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "#e6daf9",
                },
              }}
            >
              Change Photo
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
          </Stack>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={labelStyle}>First Name</Typography>
              <TextField
                fullWidth
                name="firstname"
                placeholder="Enter first name"
                value={user.firstname}
                onChange={handleChange}
                size="small"
                sx={fieldStyle}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={labelStyle}>Last Name</Typography>
              <TextField
                fullWidth
                name="lastname"
                placeholder="Enter last name"
                value={user.lastname}
                onChange={handleChange}
                size="small"
                sx={fieldStyle}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography sx={labelStyle}>Email</Typography>
              <TextField
                fullWidth
                name="email"
                type="email"
                placeholder="Enter email"
                value={user.email}
                onChange={handleChange}
                size="small"
                sx={fieldStyle}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography sx={labelStyle}>Address</Typography>
              <TextField
                fullWidth
                name="address"
                placeholder="Enter address"
                value={user.address}
                onChange={handleChange}
                size="small"
                sx={fieldStyle}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={labelStyle}>Country</Typography>
              <TextField
                select
                fullWidth
                name="country"
                value={user.country}
                onChange={handleChange}
                size="small"
                sx={fieldStyle}
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem value="">Select Country</MenuItem>
                {uniqueCountries.map((item, index) => {
                  const value = getCountryValue(item);
                  return (
                    <MenuItem key={`${value}-${index}`} value={value}>
                      {value}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={labelStyle}>State</Typography>
              <TextField
                select
                fullWidth
                name="state"
                value={user.state}
                onChange={handleChange}
                size="small"
                sx={fieldStyle}
                SelectProps={{ displayEmpty: true }}
                disabled={!user.country}
              >
                <MenuItem value="">Select State</MenuItem>
                {uniqueStates.map((item, index) => {
                  const value = getStateValue(item);
                  return (
                    <MenuItem key={`${value}-${index}`} value={value}>
                      {value}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={labelStyle}>City</Typography>
              <TextField
                select
                fullWidth
                name="city"
                value={user.city}
                onChange={handleChange}
                size="small"
                sx={fieldStyle}
                SelectProps={{ displayEmpty: true }}
                disabled={!user.state}
              >
                <MenuItem value="">Select City</MenuItem>
                {uniqueCities.map((item, index) => {
                  const value = getCityValue(item);
                  return (
                    <MenuItem key={`${value}-${index}`} value={value}>
                      {value}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={labelStyle}>Zip Code</Typography>
              <TextField
                fullWidth
                name="zip"
                placeholder="Enter zip"
                value={user.zip}
                onChange={handleChange}
                size="small"
                sx={fieldStyle}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={labelStyle}>New Password</Typography>
              <TextField
                fullWidth
                name="password"
                type="password"
                placeholder="Enter new password"
                value={user.password}
                onChange={handleChange}
                size="small"
                autoComplete="new-password"
                sx={fieldStyle}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography sx={labelStyle}>Confirm Password</Typography>
              <TextField
                fullWidth
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={user.confirmPassword}
                onChange={handleChange}
                size="small"
                autoComplete="new-password"
                sx={fieldStyle}
              />
            </Grid>
          </Grid>

          <Stack direction="row" spacing={1.2} sx={{ pt: 1 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={saving}
              sx={{
                textTransform: "none",
                bgcolor: "#8e44ec",
                px: 2,
                py: 0.8,
                fontSize: "0.9rem",
                borderRadius: 1,
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#6d28d9",
                  boxShadow: "none",
                },
              }}
            >
              {saving ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                "Update User"
              )}
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate("/dashboard/userspage")}
              sx={{
                textTransform: "none",
                px: 2,
                py: 0.8,
                fontSize: "0.9rem",
                borderRadius: 1,
                color: "#8a8a8a",
                borderColor: "#d0d0d0",
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

const labelStyle = {
  fontSize: "0.95rem",
  color: "#111",
  mb: 0.6,
};

const fieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1,
    backgroundColor: "#fff",
  },
  "& .MuiInputBase-input": {
    fontSize: "0.92rem",
    py: 1.2,
  },
};

export default EditUser;