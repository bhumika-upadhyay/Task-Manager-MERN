
import React, { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
  useMediaQuery,
  Badge,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";

import {
  Assignment,
  CheckCircle,
  WarningAmber,
  People,
  Add,
  PersonAdd,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";

import { getTasks } from "../services/taskService";

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({});
  const [selectedDate, setSelectedDate] = useState(dayjs());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTasks();
        setTasks(Array.isArray(res) ? res : []);

        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser || {});
      } catch (err) {
        console.log("Fetch dashboard data error:", err);
        setTasks([]);
      }
    };

    fetchData();
  }, []);

  const isTaskOverdue = (task) => {
    if (!task?.dueDate) return false;
    if (task?.status === "Completed") return false;
    return dayjs(task.dueDate).endOf("day").isBefore(dayjs());
  };

  const dashboardCounts = useMemo(() => {
    return {
      pending: tasks.filter(
        (t) =>
          !isTaskOverdue(t) &&
          (t.status === "Not Started" || t.status === "Pending")
      ).length,
      completed: tasks.filter((t) => t.status === "Completed").length,
      overdue: tasks.filter((t) => isTaskOverdue(t)).length,
      total: tasks.length,
    };
  }, [tasks]);

  const cards = [
    {
      title: "Pending Tasks",
      value: dashboardCounts.pending,
      icon: <Assignment color="warning" sx={{ fontSize: 38 }} />,
    },
    {
      title: "Completed Tasks",
      value: dashboardCounts.completed,
      icon: <CheckCircle color="success" sx={{ fontSize: 38 }} />,
    },
    {
      title: "Overdue Tasks",
      value: dashboardCounts.overdue,
      icon: <WarningAmber color="error" sx={{ fontSize: 38 }} />,
    },
    {
      title: "My Tasks",
      value: dashboardCounts.total,
      icon: <People color="primary" sx={{ fontSize: 38 }} />,
    },
  ];

  const recentTasks = useMemo(() => {
    return [...tasks].slice(-5).reverse();
  }, [tasks]);

  const getPriorityColor = (priority) => {
    if (priority === "High") return "error";
    if (priority === "Medium") return "warning";
    return "success";
  };

  const getStatusColor = (task) => {
    if (isTaskOverdue(task)) return "error";
    if (task.status === "Completed") return "success";
    if (task.status === "In Progress") return "info";
    if (task.status === "Not Started" || task.status === "Pending")
      return "warning";
    return "default";
  };

  const getDisplayStatus = (task) => {
    if (isTaskOverdue(task)) return "Overdue";
    return task.status || "Pending";
  };

  const taskStatusByDate = useMemo(() => {
    const statusMap = {};

    tasks.forEach((task) => {
      if (!task.dueDate) return;

      const dateKey = dayjs(task.dueDate).format("YYYY-MM-DD");

      if (!statusMap[dateKey]) {
        statusMap[dateKey] = {
          completed: false,
          overdue: false,
          pending: false,
        };
      }

      if (task.status === "Completed") {
        statusMap[dateKey].completed = true;
      } else if (isTaskOverdue(task)) {
        statusMap[dateKey].overdue = true;
      } else if (
        task.status === "In Progress" ||
        task.status === "Not Started" ||
        task.status === "Pending"
      ) {
        statusMap[dateKey].pending = true;
      }
    });

    const finalMap = {};

    Object.keys(statusMap).forEach((dateKey) => {
      if (statusMap[dateKey].completed) {
        finalMap[dateKey] = "completed";
      } else if (statusMap[dateKey].overdue) {
        finalMap[dateKey] = "overdue";
      } else if (statusMap[dateKey].pending) {
        finalMap[dateKey] = "pending";
      }
    });

    return finalMap;
  }, [tasks]);

  const CalendarDay = (props) => {
    const { day, outsideCurrentMonth, ...other } = props;

    const dateKey = dayjs(day).format("YYYY-MM-DD");
    const status = taskStatusByDate[dateKey];

    let dotColor = "transparent";
    if (status === "completed") dotColor = "#16a34a";
    if (status === "overdue") dotColor = "#dc2626";
    if (status === "pending") dotColor = "#f59e0b";

    return (
      <Badge
        overlap="circular"
        variant="dot"
        invisible={!status}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{
          "& .MuiBadge-badge": {
            backgroundColor: dotColor,
            color: dotColor,
          },
        }}
      >
        <PickersDay
          {...other}
          day={day}
          outsideCurrentMonth={outsideCurrentMonth}
          sx={{
            ...(status === "completed" && {
              border: "1.5px solid #16a34a",
            }),
            ...(status === "overdue" && {
              border: "1.5px solid #dc2626",
            }),
            ...(status === "pending" && {
              border: "1.5px solid #f59e0b",
            }),
          }}
        />
      </Badge>
    );
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        width: "100%",
        px: { xs: 1.5, sm: 2.5, md: 3, lg: 4 },
        py: { xs: 2, sm: 3, md: 4 },
        backgroundColor: "#f8fbff",
      }}
    >
      <Card
        sx={{
          mb: 3,
          borderRadius: 4,
          background: "linear-gradient(135deg, #dbeafe, #eff6ff)",
          boxShadow: 2,
        }}
      >
        <CardContent
          sx={{
            py: { xs: 3, sm: 4, md: 5 },
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Stack
            spacing={1}
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              fontWeight="bold"
              sx={{ wordBreak: "break-word" }}
            >
              Welcome to TaskFlow, {user?.firstname || user?.name || "User"}!
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: 700,
                fontSize: { xs: "0.95rem", sm: "1rem" },
              }}
            >
              Here&apos;s what&apos;s happening today in your workspace.
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {cards.map((card, idx) => (
          <Grid key={idx} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                height: "100%",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                  py: 3,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    {card.title}
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    sx={{ fontSize: { xs: "1.5rem", sm: "1.8rem" } }}
                  >
                    {card.value}
                  </Typography>
                </Box>

                <Box sx={{ flexShrink: 0 }}>{card.icon}</Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} alignItems="stretch">
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ p: { xs: 1.5, sm: 2.5 }, height: "100%" }}>
              <Typography
                variant="h6"
                mb={2}
                textAlign="center"
                fontWeight="bold"
              >
                Recent Tasks
              </Typography>

              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  overflowX: "auto",
                  borderRadius: 2,
                }}
              >
                <Table
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    minWidth: 760,
                    "& .MuiTableCell-root": {
                      verticalAlign: "middle",
                      textAlign: "center",
                    },
                    "& .MuiTableHead-root .MuiTableCell-root": {
                      fontWeight: 700,
                      backgroundColor: "#f8fafc",
                      whiteSpace: "nowrap",
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Task Name</TableCell>
                     
                      <TableCell>Due Date</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {recentTasks.length > 0 ? (
                      recentTasks.map((task) => (
                        <TableRow key={task._id} hover>
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              minWidth: 170,
                            }}
                          >
                            {task.title || "N/A"}
                          </TableCell>


                          <TableCell sx={{ minWidth: 120 }}>
                            {task.dueDate
                              ? dayjs(task.dueDate).format("DD MMM YYYY")
                              : "N/A"}
                          </TableCell>

                          <TableCell sx={{ minWidth: 110 }}>
                            <Chip
                              label={task.priority || "Low"}
                              color={getPriorityColor(task.priority)}
                              size="small"
                              sx={{ minWidth: 90 }}
                            />
                          </TableCell>

                          <TableCell sx={{ minWidth: 130 }}>
                            <Chip
                              label={getDisplayStatus(task)}
                              color={getStatusColor(task)}
                              size="small"
                              sx={{ minWidth: 100 }}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No Tasks Available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                p: { xs: 1.5, sm: 2.5 },
                height: "100%",
              }}
            >
              <Typography
                variant="h6"
                mb={2}
                textAlign="center"
                fontWeight="bold"
              >
                Calendar
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                flexWrap="wrap"
                useFlexGap
                sx={{ mb: 2 }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: "#f59e0b",
                    }}
                  />
                  <Typography variant="caption">Pending</Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: "#dc2626",
                    }}
                  />
                  <Typography variant="caption">Overdue</Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: "#16a34a",
                    }}
                  />
                  <Typography variant="caption">Completed</Typography>
                </Stack>
              </Stack>

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar
                    value={selectedDate}
                    onChange={(newValue) => {
                      if (newValue) setSelectedDate(newValue);
                    }}
                    slots={{ day: CalendarDay }}
                    sx={{
                      width: "100%",
                      maxWidth: isTablet ? "100%" : 340,
                      mx: "auto",
                      "& .MuiPickersCalendarHeader-root": {
                        px: 1,
                      },
                      "& .MuiDayCalendar-weekDayLabel": {
                        width: isMobile ? 32 : 36,
                      },
                      "& .MuiPickersDay-root": {
                        margin: isMobile ? "2px" : "4px",
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ mt: 4 }}
      >
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/dashboard/AddTasks")}
          sx={{
            minWidth: { xs: "100%", sm: 170 },
            py: 1.2,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          New Task
        </Button>

        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => navigate("/dashboard/userpage")}
          sx={{
            minWidth: { xs: "100%", sm: 170 },
            py: 1.2,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          New User
        </Button>
      </Stack>
    </Box>
  );
};

export default Home;