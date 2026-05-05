import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["Pending", "Completed","overdue"],
      default: "Pending",
    },

    dueDate: {
      type: Date,
      default: null,
    },

    assignedUsers: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

const TaskModel = mongoose.model("Task", taskSchema);

export default TaskModel;