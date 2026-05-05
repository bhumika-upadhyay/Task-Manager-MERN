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
  Paper,
  TextField,
  AppBar,
  Toolbar,
  Box,
  TableContainer,
  InputAdornment,
  TablePagination,
  Stack,
  useMediaQuery,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CountryService from "../services/countryService.js";

const Country = () => {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [editingId, setEditingId] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchCountries = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await CountryService.getCountries();

      if (Array.isArray(res)) {
        setCountries(res);
      } else if (res?.countries) {
        setCountries(res.countries);
      } else {
        setCountries([]);
      }
    } catch (err) {
      setError(typeof err === "string" ? err : "Failed to fetch countries");
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleOpen = () => {
    setShowForm(true);
    setCountry("");
    setEditingId(null);
    setError("");
  };

  const handleEdit = (item) => {
    setShowForm(true);
    setCountry(item.name || "");
    setEditingId(item._id);
    setError("");
  };

  const handleSubmit = async () => {
    if (!country.trim()) {
      setError("Country name is required");
      return;
    }

    try {
      setSubmitLoading(true);
      setError("");

      if (editingId) {
        // update API ready hone par uncomment/use karna
        await CountryService.updateCountry(editingId, country.trim());
      } else {
        await CountryService.createCountry(country.trim());
      }

      setCountry("");
      setEditingId(null);
      setShowForm(false);
      await fetchCountries();
    } catch (err) {
      setError(typeof err === "string" ? err : "Failed to save country");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this country?"
    );

    if (!confirmDelete) return;

    try {
      await CountryService.deleteCountry(id);
      await fetchCountries();
    } catch (err) {
      setError(typeof err === "string" ? err : "Failed to delete country");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setCountry("");
    setEditingId(null);
    setError("");
  };

  const filteredCountries = countries.filter((item) =>
    item?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedData = filteredCountries.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Box mb={3}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "#1976d2",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Toolbar
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              gap: 2,
              py: { xs: 2, sm: 1 },
            }}
          >
            <Typography
              variant={isMobile ? "h6" : "h5"}
              sx={{
                flexGrow: 1,
                fontWeight: 600,
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              Country Management
            </Typography>

            <Button
              variant="contained"
              onClick={handleOpen}
              fullWidth={isMobile}
              sx={{
                bgcolor: "white",
                color: "#1976d2",
                fontWeight: 600,
                borderRadius: 2,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#f4f6f8",
                },
              }}
            >
              + Add Country
            </Button>
          </Toolbar>
        </AppBar>
      </Box>

      <Box mb={3}>
        <TextField
          fullWidth
          label="Search Country"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          size={isMobile ? "small" : "medium"}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {showForm && (
        <Box mb={3}>
          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              boxShadow: 2,
            }}
          >
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={600}>
                {editingId ? "Edit Country" : "Add Country"}
              </Typography>

              <TextField
                fullWidth
                label="Country Name"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                size={isMobile ? "small" : "medium"}
              />

              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={submitLoading}
                  fullWidth={isMobile}
                  sx={{ textTransform: "none", borderRadius: 2 }}
                >
                  {submitLoading
                    ? "Saving..."
                    : editingId
                    ? "Update Country"
                    : "Save Country"}
                </Button>

                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  fullWidth={isMobile}
                  sx={{ textTransform: "none", borderRadius: 2 }}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      )}

      <Box>
        <Paper
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: 2,
          }}
        >
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 500 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                  <TableCell>
                    <b>Country Name</b>
                  </TableCell>
                  <TableCell align="center" sx={{ width: 140 }}>
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      <Box py={2}>
                        <CircularProgress size={28} />
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((item) => (
                    <TableRow key={item._id} hover>
                      <TableCell
                        sx={{
                          wordBreak: "break-word",
                          fontSize: { xs: "14px", sm: "15px" },
                        }}
                      >
                        {item.name}
                      </TableCell>

                      <TableCell align="center">
                        <Tooltip title="Edit">
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(item)}
                            size={isMobile ? "small" : "medium"}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(item._id)}
                            size={isMobile ? "small" : "medium"}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      No Countries Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredCountries.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 15]}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            sx={{
              "& .MuiTablePagination-toolbar": {
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 1,
                px: { xs: 1, sm: 2 },
              },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                {
                  margin: 0,
                },
            }}
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default Country;