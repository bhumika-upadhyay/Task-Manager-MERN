import TaskModel from "../models/TaskModel.js";

// CREATE TASK
export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      status,
      dueDate,
      assignedUsers,
    } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    let finalStatus = status || "Pending";

    // Auto overdue check
    if (
      dueDate &&
      new Date(dueDate) < new Date() &&
      finalStatus !== "Completed"
    ) {
      finalStatus = "overdue";
    }

    const task = await TaskModel.create({
      title: title.trim(),
      description,
      priority,
      status: finalStatus,
      dueDate,
      assignedUsers: assignedUsers || [],
    });

    res.status(201).json(task);

  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    res.status(500).json({
      message: "Failed to create task",
      error: err.message,
    });
  }
};



// GET ALL TASKS
export const getTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.find().sort({ createdAt: -1 });

    const today = new Date();

    const updatedTasks = await Promise.all(
      tasks.map(async (task) => {

        if (
          task.status !== "Completed" &&
          task.dueDate &&
          new Date(task.dueDate) < today &&
          task.status !== "overdue"
        ) {
          task.status = "overdue";
          await task.save();
        }

        return task;
      })
    );

    res.status(200).json(updatedTasks);

  } catch (err) {
    console.error("GET TASK ERROR:", err);
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: err.message,
    });
  }
};



// UPDATE TASK
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { dueDate, status } = req.body;

    let finalStatus = status;

    // overdue check
    if (
      dueDate &&
      new Date(dueDate) < new Date() &&
      status !== "Completed"
    ) {
      finalStatus = "overdue";
    }

    const task = await TaskModel.findByIdAndUpdate(
      id,
      { ...req.body, status: finalStatus },
      { new: true }
    );

    res.status(200).json(task);

  } catch (err) {
    console.error("UPDATE TASK ERROR:", err);
    res.status(500).json({
      message: "Failed to update task",
      error: err.message,
    });
  }
};



// DELETE TASK
export const deleteTask = async (req, res) => {
  try {
    await TaskModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Task deleted successfully",
    });

  } catch (err) {
    console.error("DELETE TASK ERROR:", err);
    res.status(500).json({
      message: "Failed to delete task",
      error: err.message,
    });
  }
};

