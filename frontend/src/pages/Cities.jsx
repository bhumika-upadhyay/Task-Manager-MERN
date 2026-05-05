import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  TablePagination,
  Container,
  AppBar,
  Toolbar,
  Paper,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import CityService from "../services/CityService";
import StateService from "../services/StateService";
import CountryService from "../services/CountryService";

export default function Cities() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    state: "",
    zipCodes: "",
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ---------------- FETCH ----------------
  useEffect(() => {
    fetchCities();
    fetchStates();
    fetchCountries();
  }, []);

  useEffect(() => {
    setPage(0);
  }, [search]);

  const fetchCities = async () => {
    try {
      const data = await CityService.getCities();
      setCities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  };

  const fetchStates = async () => {
    try {
      const data = await StateService.getStates();
      setStates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching states:", err);
    }
  };

  const fetchCountries = async () => {
    try {
      const data = await CountryService.getCountries();
      setCountries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching countries:", err);
    }
  };

  // ---------------- FILTER STATES ----------------
  const filteredStates = states.filter((s) => {
    if (!selectedCountry) return true;

    const countryId =
      typeof s.country === "object" ? s.country?._id : s.country;

    return countryId === selectedCountry;
  });

  // ---------------- FILTER CITIES ----------------
  const filteredCities = cities.filter(
    (c) =>
      c?.name &&
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedCities = filteredCities.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // ---------------- SUBMIT ----------------
  const handleSubmit = async () => {
    if (!form.name || !form.state) {
      return alert("City and State are required!");
    }

    // Prevent duplicate (frontend check)
    const alreadyExists = cities.some(
      (c) =>
        c.name?.toLowerCase() === form.name.toLowerCase() &&
        (c.state?._id || c.state) === form.state
    );

    if (!editId && alreadyExists) {
      return alert("City already exists in this state ❌");
    }

    const payload = {
      name: form.name,
      state: form.state,
      zipCodes: form.zipCodes
        ? form.zipCodes.split(",").map((z) => z.trim())
        : [],
    };

    try {
      if (editId) {
        await CityService.updateCity(editId, payload);
        alert("City updated successfully ✅");
      } else {
        await CityService.createCity(payload);
        alert("City added successfully ✅");
      }

      setOpen(false);
      setEditId(null);
      setForm({ name: "", state: "", zipCodes: "" });
      setSelectedCountry("");
      fetchCities();
    } catch (err) {
      console.error(err);

      if (err.includes("duplicate") || err.includes("E11000")) {
        alert("City already exists in this state ❌");
      } else {
        alert("Something went wrong ❌");
      }
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this city?")) return;

    try {
      await CityService.deleteCity(id);
      fetchCities();
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- EDIT ----------------
  const handleEdit = (c) => {
    setSelectedCountry(c.state?.country?._id || "");
    setForm({
      name: c.name || "",
      state: c.state?._id || c.state || "",
      zipCodes: c.zipCodes?.join(", ") || "",
    });
    setEditId(c._id);
    setOpen(true);
  };

  // ---------------- UI ----------------
  return (
    <Container maxWidth="md">
      {/* Header */}
      <Box mt={4} mb={2}>
        <AppBar position="static">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6">City Management</Typography>
            <Button variant="contained" onClick={() => setOpen(true)}>
              + Add City
            </Button>
          </Toolbar>
        </AppBar>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={2}>
          <TextField
            size="small"
            placeholder="Search city"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Select
            fullWidth
            size="small"
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              setForm({ ...form, state: "" });
            }}
            displayEmpty
          >
            <MenuItem value="">Select Country</MenuItem>
            {countries.map((c) => (
              <MenuItem key={c._id} value={c._id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>

          <Select
            fullWidth
            size="small"
            value={form.state}
            onChange={(e) =>
              setForm({ ...form, state: e.target.value })
            }
            displayEmpty
          >
            <MenuItem value="">Select State</MenuItem>
            {filteredStates.map((s) => (
              <MenuItem key={s._id} value={s._id}>
                {s.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Paper>

      {/* Table */}
      <Table component={Paper}>
        <TableHead>
          <TableRow>
            <TableCell>City</TableCell>
            <TableCell>State</TableCell>
            <TableCell>Zip Codes</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {paginatedCities.length > 0 ? (
            paginatedCities.map((c) => (
              <TableRow key={c._id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.state?.name}</TableCell>
                <TableCell>{c.zipCodes?.join(", ")}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleEdit(c)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(c._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No Cities Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredCities.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      {/* Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{editId ? "Edit City" : "Add City"}</DialogTitle>

        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="City Name"
              size="small"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <Select
              value={form.state}
              onChange={(e) =>
                setForm({ ...form, state: e.target.value })
              }
              displayEmpty
            >
              <MenuItem value="">Select State</MenuItem>
              {filteredStates.map((s) => (
                <MenuItem key={s._id} value={s._id}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>

            <TextField
              label="Zip Codes (comma separated)"
              size="small"
              value={form.zipCodes}
              onChange={(e) =>
                setForm({ ...form, zipCodes: e.target.value })
              }
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editId ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}