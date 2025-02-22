import React, { useState, useContext } from "react";
import axios from "axios";
import "./TaskForm.css";
import { AuthContext } from "../../provider/AuthProvider";

const TaskForm = ({ refreshTasks }) => {
  const { user } = useContext(AuthContext);
  const [taskData, setTaskData] = useState({
    task: "",
    status: "todo",
    tags: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskData.task.trim()) return alert("Task title is required!");
    if (taskData.task.length > 50) return alert("Task title must be under 50 characters!");

    const newTask = {
      ...taskData,
      email: user.email,
    };

    try {
      const { data } = await axios.post("https://task-management-server-fmbfsfprz.vercel.app/tasks", newTask);
      if (data.insertedId) {
        refreshTasks();
        setTaskData({ task: "", status: "todo", tags: [] });
      }
    } catch (error) {
      console.error("Task creation failed:", error);
    }
  };

  return (
    <header className="app_header">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="task"
          value={taskData.task}
          className="task_input"
          placeholder="Enter task title (max 50 characters)"
          onChange={handleChange}
          maxLength="50"
        />
        <div className="task_form_bottom_line">
          <select name="status" value={taskData.status} className="task_status" onChange={handleChange}>
            <option value="todo">To do</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
          </select>
          <button type="submit" className="task_submit">+ Add Task</button>
        </div>
      </form>
    </header>
  );
};

export default TaskForm;
