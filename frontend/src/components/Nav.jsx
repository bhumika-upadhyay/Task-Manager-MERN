import * as React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import {
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Badge,
  Box,
  Menu,
  MenuItem,
  useMediaQuery,
  Avatar,
  Tooltip,
} from "@mui/material";

import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
  GroupAdd as GroupAddIcon,
  Task as TaskIcon,
  Language as LanguageIcon,
  LocationOn as LocationOnIcon,
  LocationCity as LocationCityIcon,
  AccountCircle,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";

const drawerWidth = 220;
const collapsedWidth = 65;

const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  [theme.breakpoints.up("md")]: {
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  },
}));

const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: open ? drawerWidth : collapsedWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  "& .MuiDrawer-paper": {
    top: 0,
    height: "100vh",
    overflowX: "hidden",
    boxSizing: "border-box",
    width: open ? drawerWidth : collapsedWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1.5),
  ...theme.mixins.toolbar,
}));

const safeParse = (value, fallback) => {
  try {
    if (!value) return fallback;
    return JSON.parse(value);
  } catch (error) {
    console.error("JSON parse error:", error);
    return fallback;
  }
};

const getLatestUser = (storedUser) => {
  if (Array.isArray(storedUser)) {
    return storedUser[storedUser.length - 1] || {};
  }
  if (storedUser && typeof storedUser === "object") {
    return storedUser;
  }
  return {};
};

const getDisplayName = (user) => {
  return (
    user?.firstname?.trim() ||
    user?.fullname?.trim() ||
    `${user?.firstname || ""} ${user?.lastname || ""}`.trim() ||
    user?.name?.trim() ||
    user?.email?.trim() ||
    "User"
  );
};

const getProfileImage = (user) => {
  return (
    user?.photo ||
    user?.profileImage ||
    user?.profile ||
    user?.avatar ||
    user?.image ||
    ""
  );
};

export default function MiniDrawer() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [avatarError, setAvatarError] = useState(false);

  const handleDrawerOpen = () => {
    if (isMobile) {
      setMobileOpen(true);
    } else {
      setOpen(true);
    }
  };

  const handleDrawerClose = () => {
    if (isMobile) {
      setMobileOpen(false);
    } else {
      setOpen(false);
    }
  };

  const handleNotificationMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setAnchorEl(null);
  };

  const loadUser = useCallback(() => {
    const storedUser = safeParse(localStorage.getItem("user"), {});
    const latestUser = getLatestUser(storedUser);
    setUser(latestUser);
    setAvatarError(false);
  }, []);

  const loadNotifications = useCallback(() => {
    try {
      const storedTasks = safeParse(localStorage.getItem("tasks"), []);
      const storedUserData = safeParse(localStorage.getItem("user"), {});
      const storedCities = safeParse(localStorage.getItem("cities"), []);

      const newNotifs = [];

      if (Array.isArray(storedTasks)) {
        storedTasks.forEach((task) => {
          const taskTitle = task?.title?.trim();
          if (!taskTitle) return;

          if (task?.isNew) {
            newNotifs.push(`New task added: ${taskTitle}`);
          }

          if (task?.status === "Completed") {
            newNotifs.push(`Task completed: ${taskTitle}`);
          }

          if (task?.status === "Pending") {
            newNotifs.push(`Pending task: ${taskTitle}`);
          }

          if (task?.status === "Overdue") {
            newNotifs.push(`Task overdue: ${taskTitle}`);
          }
        });
      }

      const latestUser = getLatestUser(storedUserData);
      const userName =
        latestUser?.fullname?.trim() ||
        `${latestUser?.firstname || ""} ${latestUser?.lastname || ""}`.trim() ||
        latestUser?.email?.trim();

      if (userName) {
        newNotifs.push(`Welcome ${userName}`);
      }

      if (Array.isArray(storedCities) && storedCities.length > 0) {
        const latestCity = storedCities[storedCities.length - 1];
        const cityName =
          latestCity?.name?.trim() || latestCity?.cityName?.trim() || "";

        if (cityName) {
          newNotifs.push(`New city added: ${cityName}`);
        }
      }

      const uniqueNotifications = [...new Set(newNotifs)].reverse();
      setNotifications(uniqueNotifications);
    } catch (error) {
      console.error("Notification load error:", error);
      setNotifications([]);
    }
  }, []);

  useEffect(() => {
    loadUser();
    loadNotifications();

    window.addEventListener("user-updated", loadUser);
    window.addEventListener("storage", loadUser);

    window.addEventListener("task-updated", loadNotifications);
    window.addEventListener("user-updated", loadNotifications);
    window.addEventListener("city-updated", loadNotifications);
    window.addEventListener("storage", loadNotifications);

    return () => {
      window.removeEventListener("user-updated", loadUser);
      window.removeEventListener("storage", loadUser);

      window.removeEventListener("task-updated", loadNotifications);
      window.removeEventListener("user-updated", loadNotifications);
      window.removeEventListener("city-updated", loadNotifications);
      window.removeEventListener("storage", loadNotifications);
    };
  }, [loadUser, loadNotifications]);

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  const menuItems = useMemo(
    () => [
      { text: "Home", icon: <HomeIcon />, path: "/dashboard/home" },
      { text: "Task", icon: <TaskIcon />, path: "/dashboard/task2" },
      { text: "Users", icon: <GroupAddIcon />, path: "/dashboard/userspage" },
      { text: "Country", icon: <LanguageIcon />, path: "/dashboard/country" },
      { text: "State", icon: <LocationCityIcon />, path: "/dashboard/state" },
      { text: "City", icon: <LocationOnIcon />, path: "/dashboard/cities" },
       { text: "setting", icon: <SettingsIcon />, path: "/dashboard/setting" },
    ],
    []
  );

  const userName = getDisplayName(user);
  const profileImage = getProfileImage(user);

  const isMenuItemSelected = (path) => {
    return location.pathname === path;
  };

  const handleProfileClick = () => {
    if (user?._id) {
      navigate(`/dashboard/userprofile/${user._id}`);
    } else {
      navigate("/dashboard/userprofile");
    }
  };

  const drawerContent = (
    <>
      <DrawerHeader>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            component="img"
            src="./logo.png"
            alt="logo"
            sx={{
              width: 45,
              height: 35,
              objectFit: "contain",
              flexShrink: 0,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              opacity: isMobile || open ? 1 : 0,
              width: isMobile || open ? "auto" : 0,
              overflow: "hidden",
              transition: "all 0.3s ease",
              whiteSpace: "nowrap",
            }}
          >
            TaskFlow
          </Typography>
        </Box>

        {(isMobile || open) && (
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        )}
      </DrawerHeader>

      <Divider />

      <List sx={{ mt: 1, px: 0.5 }}>
        {menuItems.map((item) => {
          const selected = isMenuItemSelected(item.path);

          return (
            <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
              <Tooltip
                title={!open && !isMobile ? item.text : ""}
                placement="right"
              >
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={isMobile ? () => setMobileOpen(false) : undefined}
                  selected={selected}
                  sx={{
                    minHeight: 48,
                    px: 2,
                    mx: 0.5,
                    my: 0.5,
                    borderRadius: 2,
                    justifyContent: open || isMobile ? "initial" : "center",
                    "&.Mui-selected": {
                      bgcolor: "rgba(25,118,210,0.12)",
                    },
                    "&.Mui-selected:hover": {
                      bgcolor: "rgba(25,118,210,0.18)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      minWidth: 0,
                      mr: open || isMobile ? 2 : 0,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: selected ? "primary.main" : "inherit",
                    }}
                  >
                    {item.icon}
                  </Box>

                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: open || isMobile ? 1 : 0,
                      transition: "0.3s",
                      "& .MuiTypography-root": {
                        fontWeight: selected ? 600 : 500,
                      },
                    }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <CssBaseline />

      <StyledAppBar position="fixed" open={!isMobile && open}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 1,
            px: { xs: 1.5, sm: 2 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1rem", sm: "1.15rem" },
              }}
            >
              TM
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, sm: 1 },
              ml: "auto",
            }}
          >
            <IconButton
              color="inherit"
              onClick={handleNotificationMenuOpen}
              aria-label="notifications"
            >
              <Badge badgeContent={notifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleNotificationMenuClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              {notifications.length === 0 ? (
                <MenuItem onClick={handleNotificationMenuClose}>
                  No notifications
                </MenuItem>
              ) : (
                notifications.map((notification, index) => (
                  <MenuItem
                    key={`${notification}-${index}`}
                    onClick={handleNotificationMenuClose}
                    sx={{
                      whiteSpace: "normal",
                      maxWidth: 320,
                    }}
                  >
                    {notification}
                  </MenuItem>
                ))
              )}
            </Menu>

            <Box
              onClick={handleProfileClick}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                px: 1,
                py: 0.5,
                borderRadius: 2,
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.12)",
                },
              }}
            >
              {profileImage && !avatarError ? (
                <Avatar
                  src={profileImage}
                  alt={userName}
                  onError={() => setAvatarError(true)}
                  sx={{
                    width: 34,
                    height: 34,
                    border: "2px solid rgba(255,255,255,0.4)",
                  }}
                />
              ) : (
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    bgcolor: "rgba(255,255,255,0.2)",
                    border: "2px solid rgba(255,255,255,0.4)",
                  }}
                >
                  {userName?.charAt(0)?.toUpperCase() || <AccountCircle />}
                </Avatar>
              )}

              {!isMobile && (
                <Typography
                  sx={{
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    maxWidth: 120,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {userName}
                </Typography>
              )}
            </Box>
          </Box>
        </Toolbar>
      </StyledAppBar>

      {isMobile ? (
        <MuiDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </MuiDrawer>
      ) : (
        <StyledDrawer variant="permanent" open={open}>
          {drawerContent}
        </StyledDrawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          p: { xs: 2, sm: 3 },
          overflowX: "hidden",
        }}
      >
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}