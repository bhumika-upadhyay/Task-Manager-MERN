import API from "./api";

// GET ALL TASKS
export const getTasks = async () => {
  try {
    const res = await API.get("/tasks");
    return res.data;
  } catch (err) {
    console.error("Get tasks error:", err);
    throw err.response?.data?.message || "Failed to fetch tasks";
  }
};

// CREATE TASK (rename addTask → createTask)
export const createTask = async (taskData) => {
  try {
    const res = await API.post("/tasks", taskData);
    return res.data;
  } catch (err) {
    console.error("Create task error:", err);
    throw err.response?.data?.message || "Failed to create task";
  }
};

// UPDATE TASK
export const updateTask = async (id, taskData) => {
  try {
    const res = await API.put(`/tasks/${id}`, taskData);
    return res.data;
  } catch (err) {
    console.error("Update task error:", err);
    throw err.response?.data?.message || "Failed to update task";
  }
};

// DELETE TASK
export const deleteTask = async (id) => {
  try {
    const res = await API.delete(`/tasks/${id}`);
    return res.data;
  } catch (err) {
    console.error("Delete task error:", err);
    throw err.response?.data?.message || "Failed to delete task";
  }
};



