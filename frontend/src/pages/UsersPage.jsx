

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  IconButton,
  Button,
  TextField,
  Avatar,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
      alert("Failed to fetch users");
      setUsers([]);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      alert("User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    }
  };

  const filteredUsers = users.filter((user) => {
    const fullName =
      user?.fullname ||
      `${user?.firstname || ""} ${user?.lastname || ""}`.trim();

    return (
      fullName.toLowerCase().includes(search.toLowerCase()) ||
      (user?.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (user?.city || "").toLowerCase().includes(search.toLowerCase()) ||
      (user?.state || "").toLowerCase().includes(search.toLowerCase()) ||
      (user?.country || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="h4" fontWeight="bold">
          User Management
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/dashboard/adduser")}
        >
          Add User
        </Button>
      </Box>

      <Box mb={2}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search users by name, email, city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>City / State / Country</TableCell>
              <TableCell>ZIP</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const displayName =
                  user?.fullname ||
                  `${user?.firstname || ""} ${user?.lastname || ""}`.trim() ||
                  "-";

                const profilePhoto =
                  user?.photo ||
                  user?.profileImage ||
                  user?.profile ||
                  user?.avatar ||
                  "";

                return (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar
                          src={profilePhoto}
                          alt={displayName}
                          sx={{ width: 38, height: 38 }}
                        >
                          {displayName?.charAt(0)?.toUpperCase()}
                        </Avatar>

                        <Typography fontWeight={500}>{displayName}</Typography>
                      </Box>
                    </TableCell>

                    <TableCell>{user?.email || "-"}</TableCell>
                    <TableCell>{user?.address || "-"}</TableCell>
                    <TableCell>
                      {user?.city || "-"}, {user?.state || "-"},{" "}
                      {user?.country || "-"}
                    </TableCell>
                    <TableCell>{user?.zip || "-"}</TableCell>

                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() =>
                          navigate(`/dashboard/edituser/${user._id}`)
                        }
                      >
                        <Edit />
                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={() => handleDelete(user._id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Users;
