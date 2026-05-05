

import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Card,
  CardContent,
  Chip,
  Stack,
  useMediaQuery,
  Avatar,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import { getTasks, deleteTask, updateTask } from "../services/taskService";
import UserService from "../services/userService";

const IMAGE_BASE_URL = "http://localhost:5000/uploads/";

const Task = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(Array.isArray(res) ? res : []);
    } catch (err) {
      console.log(err);
      setTasks([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await UserService.getUsers();
      setUsers(Array.isArray(res) ? res : []);
    } catch (err) {
      console.log("Fetch users error:", err);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const handleStatusChange = async (task) => {
    const updatedStatus =
      task.status === "Completed" ? "Pending" : "Completed";

    try {
      await updateTask(task._id, {
        ...task,
        status: updatedStatus,
      });
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesName = (task.title || "")
      .toLowerCase()
      .includes(taskName.toLowerCase());

    const matchesDesc = (task.description || "")
      .toLowerCase()
      .includes(description.toLowerCase());

    const matchesDate = selectedDate
      ? task.dueDate && dayjs(task.dueDate).isSame(dayjs(selectedDate), "day")
      : true;

    return matchesName && matchesDesc && matchesDate;
  });

  const getPriorityColor = (priority) => {
    if (priority === "High") return "error";
    if (priority === "Medium") return "warning";
    return "success";
  };

  const getStatusColor = (status) => {
    if (status === "Completed") return "success";
    if (status === "overdue") return "error";
    if (status === "In Progress") return "info";
    return "warning";
  };

  const getUserDisplayName = (user) => {
    return (
      user?.fullname ||
      `${user?.firstname || ""} ${user?.lastname || ""}`.trim() ||
      user?.email ||
      "User"
    );
  };

  const getInitial = (name) => {
    return name?.charAt(0)?.toUpperCase() || "U";
  };

  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http://") || img.startsWith("https://")) {
      return img;
    }
    return `${IMAGE_BASE_URL}${img}`;
  };

  const getUserPhoto = (user) => {
    return (
      user?.photo ||
      user?.profileImage ||
      user?.profile ||
      user?.avatar ||
      ""
    );
  };

  const findMatchedUser = (assignedName) => {
    if (!assignedName) return null;

    return (
      users.find((user) => {
        const fullName = getUserDisplayName(user).toLowerCase();
        return fullName === assignedName.toLowerCase();
      }) || null
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        p={{ xs: 2, sm: 3, md: 4, lg: 6 }}
        sx={{ bgcolor: "#f4f6f8", minHeight: "100vh" }}
      >
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          justifyContent="space-between"
          alignItems={isMobile ? "flex-start" : "center"}
          mb={3}
          gap={isMobile ? 2 : 0}
        >
          <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
            Task Manager
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ borderRadius: 2, textTransform: "none" }}
            onClick={() => navigate("/dashboard/AddTasks")}
          >
            Add Task
          </Button>
        </Box>

        <Card sx={{ borderRadius: 3, mb: 3 }}>
          <CardContent>
         
            <Stack
  direction={isMobile ? "column" : "row"}
  spacing={2}
  flexWrap="wrap"
  alignItems="center"
>
  <TextField
    label="Search Task"
    size="small"
    value={taskName}
    onChange={(e) => setTaskName(e.target.value)}
    sx={{
      minWidth: 220,
      "& .MuiOutlinedInput-root": {
        height: 56,
      },
    }}
  />

  <TextField
    label="Description"
    size="small"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    sx={{
      minWidth: 220,
      "& .MuiOutlinedInput-root": {
        height: 56,
      },
    }}
  />

  <DatePicker
    label="Due Date"
    value={selectedDate}
    onChange={(newValue) => setSelectedDate(newValue)}
  />
</Stack>
          </CardContent>
        </Card>

        <Box sx={{ overflowX: "auto" }}>
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 3, boxShadow: 3 }}
          >
            <Table>
              <TableHead sx={{ bgcolor: "#f1f5f9" }}>
                <TableRow>
                  <TableCell><b>Task</b></TableCell>
                  <TableCell><b>Description</b></TableCell>
                  <TableCell><b>Assigned Users</b></TableCell>
                  <TableCell><b>Priority</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell><b>Due Date</b></TableCell>
                  <TableCell><b>Complete</b></TableCell>
                  <TableCell><b>Action</b></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <TableRow key={task._id} hover>
                      <TableCell>{task.title}</TableCell>

                      <TableCell>{task.description || "-"}</TableCell>

                      <TableCell sx={{ minWidth: 220 }}>
                        {task.assignedUsers?.length > 0 ? (
                          <Stack
                            direction="row"
                            spacing={1}
                            useFlexGap
                            flexWrap="wrap"
                          >
                            {task.assignedUsers.map((assignedName, index) => {
                              const matchedUser = findMatchedUser(assignedName);
                              const matchedPhoto = matchedUser
                                ? getUserPhoto(matchedUser)
                                : "";

                              return (
                                <Chip
                                  key={`${assignedName}-${index}`}
                                  avatar={
                                    <Avatar
                                      src={getImageUrl(matchedPhoto)}
                                      sx={{ width: 24, height: 24 }}
                                    >
                                      {getInitial(assignedName)}
                                    </Avatar>
                                  }
                                  label={assignedName}
                                  size="small"
                                  variant="outlined"
                                />
                              );
                            })}
                          </Stack>
                        ) : (
                          "Unassigned"
                        )}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={task.priority || "Low"}
                          color={getPriorityColor(task.priority)}
                          size="small"
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={task.status || "Pending"}
                          color={getStatusColor(task.status)}
                          size="small"
                        />
                      </TableCell>

                      <TableCell>
                        {task.dueDate
                          ? dayjs(task.dueDate).format("DD MMM YYYY")
                          : "-"}
                      </TableCell>

                      <TableCell>
                        <Checkbox
                          checked={task.status === "Completed"}
                          onChange={() => handleStatusChange(task)}
                        />
                      </TableCell>

                      <TableCell>
                        <IconButton
                          onClick={() =>
                            navigate("/dashboard/AddTasks", { state: task })
                          }
                        >
                          <EditIcon />
                        </IconButton>

                        <IconButton
                          color="error"
                          onClick={() => handleDelete(task._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography mt={2}>No Tasks Found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default Task;