import React, { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  TextField,
  Typography,
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  Avatar,
  Card,
  CardContent,
  Divider,
  Snackbar,
  Alert,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import {
  createTask,
  getTasks,
  updateTask,
  deleteTask as deleteTaskAPI,
} from "../services/taskService";
import UserService from "../services/userService";

const IMAGE_BASE_URL = "http://localhost:5000/uploads/";

const AddTasks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editTaskState = location.state;

  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "warning",
  });

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (editTaskState) {
      setTaskName(editTaskState.title || "");
      setDescription(editTaskState.description || "");
      setPriority(editTaskState.priority || "Medium");
      setDueDate(editTaskState.dueDate ? dayjs(editTaskState.dueDate) : null);
      setStatus(editTaskState.status === "Completed" ? "Completed" : "Pending");
      setEditId(editTaskState._id || null);

      const existingAssignedUsers = Array.isArray(editTaskState.assignedUsers)
        ? editTaskState.assignedUsers
        : [];

      setAssignedUsers(existingAssignedUsers);

      if (users.length > 0 && existingAssignedUsers.length > 0) {
        const matchedIds = users
          .filter((user) => {
            const fullName =
              user?.fullname ||
              `${user?.firstname || ""} ${user?.lastname || ""}`.trim();
            return existingAssignedUsers.includes(fullName);
          })
          .map((user) => user._id);

        setSelectedUserIds(matchedIds);
      }
    }
  }, [editTaskState, users]);

  const blurActiveElement = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

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

  const safeNavigate = (path, state = undefined) => {
    blurActiveElement();
    setTimeout(() => {
      navigate(path, state ? { state } : undefined);
    }, 0);
  };

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Fetch tasks error:", err);
      setTasks([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await UserService.getUsers();
      setUsers(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Fetch users error:", err);
      setUsers([]);
    }
  };

  const showMessage = (message, severity = "warning") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const getUserDisplayName = (user) => {
    return (
      user?.fullname ||
      `${user?.firstname || ""} ${user?.lastname || ""}`.trim() ||
      user?.email ||
      "User"
    );
  };

  const getUserInitial = (user) => {
    return getUserDisplayName(user)?.charAt(0)?.toUpperCase() || "U";
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

  const selectedUsersData = useMemo(() => {
    return users.filter((user) => selectedUserIds.includes(user._id));
  }, [users, selectedUserIds]);

  const handleAssignedUsersChange = (event) => {
    const value = event.target.value;
    const ids = typeof value === "string" ? value.split(",") : value;

    setSelectedUserIds(ids);

    const selectedNames = users
      .filter((user) => ids.includes(user._id))
      .map((user) => getUserDisplayName(user));

    setAssignedUsers(selectedNames);
  };

  const handleRemoveAssignedUser = (id) => {
    blurActiveElement();

    const updatedIds = selectedUserIds.filter((userId) => userId !== id);
    setSelectedUserIds(updatedIds);

    const updatedNames = users
      .filter((user) => updatedIds.includes(user._id))
      .map((user) => getUserDisplayName(user));

    setAssignedUsers(updatedNames);
  };

  const toggleStatus = () => {
    blurActiveElement();
    setStatus((prev) => (prev === "Completed" ? "Pending" : "Completed"));
  };

  const getStatusChipColor = (taskStatus) => {
    if (taskStatus === "Completed") return "success";
    if (taskStatus === "overdue") return "error";
    if (taskStatus === "Pending") return "primary";
    if (taskStatus === "In Progress") return "info";
    return "default";
  };

  const getPriorityChipColor = (taskPriority) => {
    if (taskPriority === "High") return "error";
    if (taskPriority === "Medium") return "warning";
    return "success";
  };

  const saveTask = async () => {
    const trimmedTaskName = taskName.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTaskName) {
      showMessage("Please enter task name", "error");
      return;
    }

    if (!trimmedDescription) {
      showMessage("Please enter task description", "error");
      return;
    }

    if (!dueDate) {
      showMessage("Please select due date", "error");
      return;
    }

    if (assignedUsers.length === 0) {
      showMessage("Please assign at least one user", "error");
      return;
    }

    const taskData = {
      title: trimmedTaskName,
      description: trimmedDescription,
      priority,
      status,
      dueDate: dayjs(dueDate).toISOString(),
      assignedUsers,
    };

    try {
      blurActiveElement();

      if (editId) {
        await updateTask(editId, taskData);
        showMessage("Task updated successfully", "success");
      } else {
        await createTask(taskData);
        showMessage("Task added successfully", "success");
      }

      await fetchTasks();
      clearForm();

      setTimeout(() => {
        navigate("/dashboard");
      }, 0);
    } catch (err) {
      console.error("Save task error:", err);
      showMessage(
        typeof err === "string"
          ? err
          : "Something went wrong while saving task",
        "error"
      );
    }
  };

  const clearForm = () => {
    blurActiveElement();
    setTaskName("");
    setDescription("");
    setPriority("Medium");
    setAssignedUsers([]);
    setSelectedUserIds([]);
    setDueDate(null);
    setEditId(null);
    setStatus("Pending");
  };

  const handleDelete = async (id) => {
    blurActiveElement();

    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await deleteTaskAPI(id);
      await fetchTasks();
      showMessage("Task deleted successfully", "success");
    } catch (err) {
      console.error("Delete task error:", err);
      showMessage("Failed to delete task", "error");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fafc",
        px: { xs: 1.5, sm: 2.5, md: 3 },
        py: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: "1400px", mx: "auto" }}>
        <Box
          sx={{
            mb: 3,
            textAlign: { xs: "center", lg: "left" },
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            mb={1}
            sx={{
              fontSize: { xs: "1.55rem", sm: "1.9rem", md: "2.2rem" },
              lineHeight: 1.2,
            }}
          >
            {editId ? "Update Task" : "Add New Task"}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: 700,
              mx: { xs: "auto", lg: 0 },
              fontSize: { xs: "0.95rem", sm: "1rem" },
            }}
          >
            Create and assign tasks.
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 2, md: 3 }} alignItems="stretch">
          <Grid size={{ xs: 12, lg: 7 }}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent
                sx={{
                  p: { xs: 2, sm: 3, md: 3.5 },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ mb: 2.5 }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ fontSize: { xs: "1.1rem", sm: "1.2rem" } }}
                  >
                    Task Details
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Fill the details below to create or update a task.
                  </Typography>
                </Box>

                <Stack spacing={2.5} sx={{ flex: 1 }}>
                  <Box>
                    <Typography fontWeight={600} mb={1}>
                      Task Name *
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter task name..."
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                      size="medium"
                    />
                  </Box>

                  <Box>
                    <Typography fontWeight={600} mb={1}>
                      Description *
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="Write task description..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Box>

                  <Box>
                    <Typography fontWeight={600} mb={1}>
                      Assign Users *
                    </Typography>

                    <FormControl fullWidth>
                      <InputLabel id="assign-users-label">Select Users</InputLabel>
                      <Select
                        labelId="assign-users-label"
                        multiple
                        value={selectedUserIds}
                        onChange={handleAssignedUsersChange}
                        input={<OutlinedInput label="Select Users" />}
                        renderValue={(selected) =>
                          users
                            .filter((user) => selected.includes(user._id))
                            .map((user) => getUserDisplayName(user))
                            .join(", ")
                        }
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              maxHeight: 320,
                              borderRadius: 3,
                            },
                          },
                        }}
                        sx={{
                          borderRadius: 2.5,
                          bgcolor: "#fff",
                        }}
                      >
                        {users.length > 0 ? (
                          users.map((user) => (
                            <MenuItem key={user._id} value={user._id}>
                              <Stack
                                direction="row"
                                spacing={1.5}
                                alignItems="center"
                                sx={{ minWidth: 0 }}
                              >
                                <Avatar
                                  src={getImageUrl(getUserPhoto(user))}
                                  sx={{ width: 32, height: 32, flexShrink: 0 }}
                                >
                                  {getUserInitial(user)}
                                </Avatar>

                                <Box sx={{ minWidth: 0 }}>
                                  <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    noWrap
                                  >
                                    {getUserDisplayName(user)}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    noWrap
                                  >
                                    {user.email}
                                  </Typography>
                                </Box>
                              </Stack>
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>No users available</MenuItem>
                        )}
                      </Select>
                    </FormControl>

                    {selectedUsersData.length > 0 && (
                      <Stack
                        direction="row"
                        spacing={1}
                        useFlexGap
                        flexWrap="wrap"
                        mt={1.5}
                      >
                        {selectedUsersData.map((user) => (
                          <Chip
                            key={user._id}
                            avatar={
                              <Avatar src={getImageUrl(getUserPhoto(user))}>
                                {getUserInitial(user)}
                              </Avatar>
                            }
                            label={getUserDisplayName(user)}
                            onDelete={() => handleRemoveAssignedUser(user._id)}
                            color="primary"
                            variant="filled"
                            sx={{
                              borderRadius: 2,
                              maxWidth: "100%",
                              "& .MuiChip-label": {
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              },
                            }}
                          />
                        ))}
                      </Stack>
                    )}
                  </Box>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography fontWeight={600} mb={1}>
                        Due Date *
                      </Typography>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={dueDate}
                          onChange={(newValue) => setDueDate(newValue)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              placeholder: "Select due date",
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography fontWeight={600} mb={1}>
                        Priority
                      </Typography>
                      <ToggleButtonGroup
                        value={priority}
                        exclusive
                        onChange={(e, value) => value && setPriority(value)}
                        fullWidth
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          gap: 1,
                          "& .MuiToggleButton-root": {
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                            border: "1px solid #dbe3ea",
                            minHeight: 44,
                          },
                        }}
                      >
                        <ToggleButton value="Low">Low</ToggleButton>
                        <ToggleButton value="Medium">Medium</ToggleButton>
                        <ToggleButton value="High">High</ToggleButton>
                      </ToggleButtonGroup>
                    </Grid>
                  </Grid>

                  <Box>
                    <Typography fontWeight={600} mb={1}>
                      Status
                    </Typography>

                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1.5}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                    >
                      <Chip
                        label={status}
                        color={getStatusChipColor(status)}
                        onClick={toggleStatus}
                        sx={{
                          cursor: "pointer",
                          fontWeight: 600,
                          px: 1,
                          py: 2.3,
                          borderRadius: 2,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Click the chip to switch between Pending and Completed
                      </Typography>
                    </Stack>
                  </Box>

                  <Box sx={{ flexGrow: 1 }} />

                  <Divider sx={{ my: 0.5 }} />

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{ pt: 1 }}
                  >
                    <Button
                      variant="contained"
                      onClick={saveTask}
                      fullWidth
                      sx={{
                        py: 1.3,
                        borderRadius: 2.5,
                        textTransform: "none",
                        fontWeight: "bold",
                        boxShadow: "none",
                      }}
                    >
                      {editId ? "Update Task" : "Add Task"}
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={clearForm}
                      fullWidth
                      sx={{
                        py: 1.3,
                        borderRadius: 2.5,
                        textTransform: "none",
                        fontWeight: "bold",
                      }}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent
                sx={{
                  p: { xs: 2, sm: 3, md: 3.5 },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ mb: 2.5 }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ fontSize: { xs: "1.1rem", sm: "1.2rem" } }}
                  >
                    Recent Tasks
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Quick overview of the latest tasks in your workspace.
                  </Typography>
                </Box>

                <Stack
                  spacing={2}
                  sx={{
                    flex: 1,
                    minHeight: { xs: "auto", lg: 300 },
                    maxHeight: { xs: "none", lg: "72vh" },
                    overflowY: { xs: "visible", lg: "auto" },
                    pr: { lg: 0.5 },
                  }}
                >
                  {tasks.length > 0 ? (
                    tasks.map((task) => (
                      <Paper
                        key={task._id}
                        elevation={0}
                        sx={{
                          p: { xs: 1.8, sm: 2 },
                          borderRadius: 3,
                          border: "1px solid #e2e8f0",
                          bgcolor: "#fff",
                          transition: "0.2s ease",
                          "&:hover": {
                            boxShadow: "0 4px 14px rgba(15, 23, 42, 0.06)",
                          },
                        }}
                      >
                        <Typography
                          fontWeight="bold"
                          fontSize="1rem"
                          sx={{
                            wordBreak: "break-word",
                          }}
                        >
                          {task.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mt={0.8}
                          sx={{
                            wordBreak: "break-word",
                          }}
                        >
                          {task.description || "No description"}
                        </Typography>

                        <Stack
                          direction="row"
                          spacing={1}
                          useFlexGap
                          flexWrap="wrap"
                          mt={1.5}
                        >
                          <Chip
                            label={task.priority || "Low"}
                            size="small"
                            color={getPriorityChipColor(task.priority)}
                          />
                          <Chip
                            label={task.status || "Pending"}
                            size="small"
                            color={getStatusChipColor(task.status)}
                          />
                          {task.dueDate && (
                            <Chip
                              label={dayjs(task.dueDate).format("DD MMM YYYY")}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Stack>

                        {task.assignedUsers?.length > 0 && (
                          <Stack
                            direction="row"
                            spacing={1}
                            useFlexGap
                            flexWrap="wrap"
                            mt={1.5}
                          >
                            {task.assignedUsers.map((u, index) => (
                              <Chip
                                key={`${u}-${index}`}
                                label={u}
                                size="small"
                                variant="outlined"
                                sx={{
                                  maxWidth: "100%",
                                  "& .MuiChip-label": {
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  },
                                }}
                              />
                            ))}
                          </Stack>
                        )}

                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={1}
                          mt={2}
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() =>
                              safeNavigate("/dashboard/AddTasks", task)
                            }
                            fullWidth
                            sx={{
                              textTransform: "none",
                              borderRadius: 2,
                            }}
                          >
                            Edit
                          </Button>

                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleDelete(task._id)}
                            fullWidth
                            sx={{
                              textTransform: "none",
                              borderRadius: 2,
                            }}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </Paper>
                    ))
                  ) : (
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 6,
                        color: "text.secondary",
                        border: "1px dashed #cbd5e1",
                        borderRadius: 3,
                        bgcolor: "#fff",
                      }}
                    >
                      <Typography fontWeight={600}>No tasks available</Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        Create your first task from the form.
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddTasks;