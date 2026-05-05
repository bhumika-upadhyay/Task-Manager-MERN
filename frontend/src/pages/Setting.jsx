import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/Signin");
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f4f6f8",
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          textAlign: "center",
          width: "100%",
          maxWidth: 380,
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Logout
        </Typography>

        <Typography mb={3}>
          Are you sure you want to logout?
        </Typography>

        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={handleLogout}
          sx={{ mb: 2 }}
        >
          Yes, Logout
        </Button>

        <Button variant="outlined" fullWidth onClick={handleCancel}>
          Cancel
        </Button>
      </Paper>
    </Box>
  );
};

export default Logout;