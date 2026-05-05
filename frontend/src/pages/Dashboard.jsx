import React from "react";
import Nav from "../components/Nav";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

const Dashboard = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      <Nav />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          overflowX: "hidden",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;










  

  



