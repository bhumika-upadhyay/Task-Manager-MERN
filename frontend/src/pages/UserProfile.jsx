import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Stack,
  CircularProgress,
  Divider,
  Checkbox,
  FormControlLabel,
  MenuItem,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Save, Close } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import CountryService from "../services/countryService";
import StateService from "../services/stateService";
import CityService from "../services/cityService";

const API_URL = "http://localhost:5000/api/users";
const IMAGE_BASE_URL = "http://localhost:5000/uploads/";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  const [changePassword, setChangePassword] = useState(false);

  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    address: "",
    country: "",
    state: "",
    city: "",
    zip: "",
    password: "",
    profile: "",
    photo: "",
    profileImage: "",
    avatar: "",
  });

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

  const getImageUrl = (img) => {
    if (!img) return "";
    if (
      img.startsWith("http://") ||
      img.startsWith("https://") ||
      img.startsWith("blob:")
    ) {
      return img;
    }
    return `${IMAGE_BASE_URL}${img}`;
  };

  const getUserName = (userObj) => {
    return (
      userObj?.firstname ||
      userObj?.fullname ||
      userObj?.name ||
      userObj?.email ||
      "User"
    );
  };

  const getUserInitial = (userObj) => {
    return getUserName(userObj)?.charAt(0)?.toUpperCase() || "U";
  };

  const profileImage =
    user?.photo || user?.profileImage || user?.profile || user?.avatar || "";

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

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    if (!id) {
      setError("No user ID provided");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        setDropdownLoading(true);

        const res = await axios.get(`${API_URL}/${id}`);
        const data = res.data?.user || res.data || {};

        const splitName = (data?.name || "").trim().split(" ");
        const first = data?.firstname || splitName[0] || "";
        const last =
          data?.lastname ||
          (splitName.length > 1 ? splitName.slice(1).join(" ") : "");

        const fetchedUser = {
          firstname: first,
          lastname: last,
          email: data?.email || "",
          address: data?.address || "",
          country: data?.country || "",
          state: data?.state || "",
          city: data?.city || "",
          zip: data?.zip || "",
          password: "",
          profile: data?.profile || "",
          photo: data?.photo || "",
          profileImage: data?.profileImage || "",
          avatar: data?.avatar || "",
        };

        setUser(fetchedUser);

        const incomingImage =
          data?.photo ||
          data?.profileImage ||
          data?.profile ||
          data?.avatar ||
          "";

        setPreview(getImageUrl(incomingImage));

        if (fetchedUser.country) {
          const stateRes = await StateService.getStates(fetchedUser.country);
          setStateOptions(normalizeArray(stateRes));
        } else {
          setStateOptions([]);
        }

        if (fetchedUser.state) {
          const cityRes = await CityService.getCities(fetchedUser.state);
          setCityOptions(normalizeArray(cityRes));
        } else {
          setCityOptions([]);
        }

        setError("");
      } catch (err) {
        console.error("Fetch user error:", err);
        setError(err?.response?.data?.msg || "Failed to fetch user");
      } finally {
        setLoading(false);
        setDropdownLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

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
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      setError("");

      const formData = new FormData();
      formData.append("firstname", user.firstname || "");
      formData.append("lastname", user.lastname || "");
      formData.append("name", `${user.firstname} ${user.lastname}`.trim());
      formData.append("email", user.email || "");
      formData.append("address", user.address || "");
      formData.append("country", user.country || "");
      formData.append("state", user.state || "");
      formData.append("city", user.city || "");
      formData.append("zip", user.zip || "");

      if (changePassword && user.password) {
        formData.append("password", user.password);
      }

      if (selectedFile) {
        formData.append("photo", selectedFile);
      }

      const res = await axios.put(`${API_URL}/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = res.data?.user || res.data || {};

      const mergedUpdatedUser = {
        ...user,
        ...updatedUser,
        password: "",
      };

      setUser((prev) => ({
        ...prev,
        firstname: mergedUpdatedUser?.firstname || prev.firstname,
        lastname: mergedUpdatedUser?.lastname || prev.lastname,
        email: mergedUpdatedUser?.email || prev.email,
        address: mergedUpdatedUser?.address || prev.address,
        country: mergedUpdatedUser?.country || prev.country,
        state: mergedUpdatedUser?.state || prev.state,
        city: mergedUpdatedUser?.city || prev.city,
        zip: mergedUpdatedUser?.zip || prev.zip,
        password: "",
        profile: mergedUpdatedUser?.profile || prev.profile,
        photo: mergedUpdatedUser?.photo || prev.photo,
        profileImage: mergedUpdatedUser?.profileImage || prev.profileImage,
        avatar: mergedUpdatedUser?.avatar || prev.avatar,
      }));

      if (mergedUpdatedUser?.country) {
        const stateRes = await StateService.getStates(mergedUpdatedUser.country);
        setStateOptions(normalizeArray(stateRes));
      }

      if (mergedUpdatedUser?.state) {
        const cityRes = await CityService.getCities(mergedUpdatedUser.state);
        setCityOptions(normalizeArray(cityRes));
      }

      const updatedImage =
        mergedUpdatedUser?.photo ||
        mergedUpdatedUser?.profileImage ||
        mergedUpdatedUser?.profile ||
        mergedUpdatedUser?.avatar ||
        "";

      setPreview(getImageUrl(updatedImage));

      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (Array.isArray(storedUser)) {
        const lastUser = storedUser[storedUser.length - 1] || {};
        const finalUser = {
          ...lastUser,
          ...mergedUpdatedUser,
          _id: mergedUpdatedUser?._id || lastUser?._id || id,
        };
        localStorage.setItem("user", JSON.stringify(finalUser));
      } else {
        const finalUser = {
          ...(storedUser || {}),
          ...mergedUpdatedUser,
          _id: mergedUpdatedUser?._id || storedUser?._id || id,
        };
        localStorage.setItem("user", JSON.stringify(finalUser));
      }

      window.dispatchEvent(new Event("user-updated"));

      setSelectedFile(null);
      setChangePassword(false);

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update profile error:", err);
      setError(err?.response?.data?.msg || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f3f4f6",
        }}
      >
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography>Loading profile...</Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f3f4f6",
        py: { xs: 2, sm: 3, md: 4 },
        px: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          maxWidth: 980,
          mx: "auto",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(90deg, #1ea7e8 0%, #1496d4 100%)",
            px: { xs: 2, sm: 3, md: 4 },
            py: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={preview || getImageUrl(profileImage)}
              alt={getUserName(user)}
              sx={{
                width: 62,
                height: 62,
                border: "3px solid #fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                fontWeight: 700,
              }}
            >
              {getUserInitial(user)}
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

          <Box>
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 700,
                fontSize: { xs: "1.4rem", sm: "1.7rem" },
                lineHeight: 1.2,
              }}
            >
              My Profile
            </Typography>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.85)",
                fontSize: "0.95rem",
                mt: 0.4,
              }}
            >
              Manage your account settings
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={labelStyle}>First Name *</Typography>
              <TextField
                fullWidth
                name="firstname"
                value={user.firstname}
                onChange={handleChange}
                placeholder="First Name"
                size="small"
                sx={inputStyle}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography sx={labelStyle}>Last Name *</Typography>
              <TextField
                fullWidth
                name="lastname"
                value={user.lastname}
                onChange={handleChange}
                placeholder="Last Name"
                size="small"
                sx={inputStyle}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography sx={labelStyle}>Email Address *</Typography>
              <TextField
                fullWidth
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Email Address"
                size="small"
                sx={inputStyle}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography sx={labelStyle}>Address</Typography>
              <TextField
                fullWidth
                name="address"
                value={user.address}
                onChange={handleChange}
                placeholder="Address"
                size="small"
                sx={inputStyle}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Typography sx={labelStyle}>Country</Typography>
              <TextField
                select
                fullWidth
                name="country"
                value={user.country}
                onChange={handleChange}
                size="small"
                sx={inputStyle}
                disabled={dropdownLoading}
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

            <Grid size={{ xs: 12, md: 4 }}>
              <Typography sx={labelStyle}>State</Typography>
              <TextField
                select
                fullWidth
                name="state"
                value={user.state}
                onChange={handleChange}
                size="small"
                sx={inputStyle}
                disabled={!user.country || dropdownLoading}
                SelectProps={{ displayEmpty: true }}
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

            <Grid size={{ xs: 12, md: 4 }}>
              <Typography sx={labelStyle}>City</Typography>
              <TextField
                select
                fullWidth
                name="city"
                value={user.city}
                onChange={handleChange}
                size="small"
                sx={inputStyle}
                disabled={!user.state || dropdownLoading}
                SelectProps={{ displayEmpty: true }}
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

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography sx={labelStyle}>Zip Code</Typography>
              <TextField
                fullWidth
                name="zip"
                value={user.zip}
                onChange={handleChange}
                placeholder="Zip Code"
                size="small"
                sx={inputStyle}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 1.5 }} />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={changePassword}
                    onChange={(e) => setChangePassword(e.target.checked)}
                    sx={{ p: 0.5, mr: 1 }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: "0.95rem", color: "#444" }}>
                    Change Password
                  </Typography>
                }
              />
            </Grid>

            {changePassword && (
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  size="small"
                  autoComplete="new-password"
                  sx={inputStyle}
                />
              </Grid>
            )}

            {error && (
              <Grid size={{ xs: 12 }}>
                <Typography color="error" sx={{ fontSize: "0.95rem", mt: 0.5 }}>
                  {error}
                </Typography>
              </Grid>
            )}

            <Grid size={{ xs: 12 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mt: 1 }}
              >
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleUpdate}
                  disabled={updating}
                  fullWidth
                  sx={{
                    py: 1.3,
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: 600,
                    boxShadow: "none",
                    background: "linear-gradient(90deg, #1ea7e8 0%, #1696d8 100%)",
                  }}
                >
                  {updating ? "Updating..." : "Update Profile"}
                </Button>

                <Button
                  variant="contained"
                  startIcon={<Close />}
                  onClick={() => navigate("/dashboard/home")}
                  fullWidth
                  sx={{
                    py: 1.3,
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: 600,
                    boxShadow: "none",
                    backgroundColor: "#dfe5ec",
                    color: "#333",
                    "&:hover": {
                      backgroundColor: "#d3dae3",
                    },
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

const labelStyle = {
  fontSize: "0.95rem",
  fontWeight: 600,
  color: "#444",
  mb: 0.8,
};

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#fff",
  },
};

export default UserProfile;