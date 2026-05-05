import React, { useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ProtectedRoute from "./Auth/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import Signin from "./pages/Signin";
import Signup from "./pages/SignUp";
import Forgetpassword from "./pages/Forgetpassword";
import Resetpassword from "./pages/Resetpassword";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import InvalidPage from "./pages/InvalidPage";
import UserProfile from "./pages/UserProfile";
import Cities from "./pages/Cities";
import Country from "./pages/Country";
import State from "./pages/State";
import Setting from "./pages/Setting";
import Nav from "./components/Nav";
import UsersPage from "./pages/UsersPage";
import AddUser from "./pages/AddUser";
import Task2 from "./pages/Task2";
import AddTasks from "./pages/AddTasks";
import EditUser from "./pages/EditUser";

import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: "light",
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgetpassword" element={<Forgetpassword />} />
        <Route path="/resetpassword" element={<Resetpassword />} />
        <Route path="*" element={<InvalidPage />} />
        {/* Dashboard with Nested Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Nav />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="Home" element={<Home />} />
          <Route path="userprofile/:id" element={<UserProfile />} />
          <Route path="Country" element={<Country />} />
          <Route path="cities" element={<Cities />} />
          <Route path="state" element={<State />} />
          <Route path="setting" element={<Setting />} />
          <Route path="userspage" element={<UsersPage />} />
          <Route path="adduser" element={<AddUser />} />
          <Route path="edituser/:id" element={<EditUser />} />{" "}
          {/* edit route */}
          <Route path="task2" element={<Task2 />} />
          <Route path="addtasks" element={<AddTasks />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
