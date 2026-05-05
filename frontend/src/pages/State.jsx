
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  TextField,
  AppBar,
  Toolbar,
  Box,
  TableContainer,
  InputAdornment,
  TablePagination,
  MenuItem,
  Select,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

import CountryService from "../services/CountryService.js";
import StateService from "../services/stateService.js";


const State = () => {
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [stateName, setStateName] = useState("");
  const [countryId, setCountryId] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchStates();
    fetchCountries();
  }, []);

  useEffect(() => {
    setPage(0);
  }, [search]);

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

  const handleOpen = () => {
    setShowForm(true);
    setStateName("");
    setCountryId("");
    setEditId(null);
  };

  const handleSubmit = async () => {
    if (!stateName.trim() || !countryId) {
      alert("Please enter state name and select country");
      return;
    }

    try {
      const payload = {
        name: stateName.trim(),
        country: countryId,
      };

      if (editId) {
        await StateService.updateState(editId, payload);
      } else {
        await StateService.createState(payload);
      }

      handleOpen(); // reset form
      setShowForm(false);
      fetchStates();
    } catch (err) {
      console.error("Error saving state:", err);
      alert(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this state?")) return;

    try {
      await StateService.deleteState(id);
      fetchStates();
    } catch (err) {
      console.error("Error deleting state:", err);
    }
  };

  const handleEdit = (item) => {
    setStateName(item?.name || "");
    setCountryId(item?.country?._id || "");
    setEditId(item?._id);
    setShowForm(true);
  };

  const filteredStates = states.filter(
    (item) =>
      item?.name &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedData = filteredStates.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container maxWidth="md">
      {/* Header */}
      <Box mt={4}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              State Management
            </Typography>
            <Button variant="contained" onClick={handleOpen}>
              + Add State
            </Button>
          </Toolbar>
        </AppBar>
      </Box>

      {/* Search */}
      <Box mt={3}>
        <TextField
          fullWidth
          label="Search State"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Form */}
      {showForm && (
        <Box mt={3}>
          <Paper sx={{ p: 3 }}>
            <TextField
              fullWidth
              label="State Name"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Select
              fullWidth
              value={countryId}
              onChange={(e) => setCountryId(e.target.value)}
              displayEmpty
              sx={{ mb: 2 }}
            >
              <MenuItem value="">Select Country</MenuItem>
              {countries.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>

            <Button variant="contained" onClick={handleSubmit}>
              {editId ? "Update State" : "Save State"}
            </Button>
          </Paper>
        </Box>
      )}

      {/* Table */}
      <Box mt={3}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>State Name</b></TableCell>
                <TableCell><b>Country</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item?.country?.name || "-"}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleEdit(item)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item._id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No States Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={filteredStates.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </TableContainer>
      </Box>
    </Container>
  );
};

export default State;