import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { DndProvider, useDrop, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import todoIcon from "../assets/direct-hit.png";
import doingIcon from "../assets/glowing-star.png";
import doneIcon from "../assets/check-mark-button.png";
import deleteIcon from "../assets/delete.png";
import { AuthContext } from "../provider/AuthProvider";
import { Link } from "react-router-dom";

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [status, setStatus] = useState("todo");

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(`https://task-management-server-fmbfsfprz.vercel.app/tasks?email=${user.email}`);
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const addTask = async (e) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    try {
      const { data } = await axios.post("https://task-management-server-fmbfsfprz.vercel.app/tasks", {
        task: taskInput,
        status,
        email: user.email,
      });
      if (data.insertedId) {
        fetchTasks();
        setTaskInput("");
      }
    } catch (error) {
      console.error("Task creation failed:", error);
    }
  };

  const TaskColumn = ({ title, icon, status }) => {
    const [, drop] = useDrop({
      accept: "TASK",
      drop: async (item) => {
        try {
          await axios.put(`https://task-management-server-fmbfsfprz.vercel.app/tasks/${item.id}`, { status });
          fetchTasks();
        } catch (error) {
          console.error("Failed to update task status:", error);
        }
      },
    });

    return (
      <div ref={drop} className="bg-gray-100 p-4 rounded-lg shadow-md min-h-[200px]">
        <h2 className="flex items-center text-lg font-semibold mb-2">
          <img src={icon} alt="icon" className="w-6 h-6 mr-2" /> {title}
        </h2>
        {tasks
          .filter((task) => task.status === status)
          .map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
      </div>
    );
  };

  const TaskCard = ({ task }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "TASK",
      item: { id: task._id },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });

    const deleteTask = async () => {
      try {
        await axios.delete(`https://task-management-server-fmbfsfprz.vercel.app/tasks/${task._id}`);
        fetchTasks();
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    };

    return (
      <div ref={drag} className={`p-3 bg-white shadow-md rounded-md flex justify-between items-center my-2 ${isDragging ? "opacity-50" : "opacity-100"}`}>
        <p className="text-sm font-medium">{task.task}</p>
        <button onClick={deleteTask} className="p-1 hover:bg-gray-200 rounded-full">
          <img src={deleteIcon} alt="Delete" className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Navbar */}
        <header className="bg-blue-500 text-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Task Manager</h1>
          <div className="flex items-center space-x-4">
            <img src={user?.photoURL} alt="Avatar" className="w-8 h-8 rounded-full" />
            <span>{user?.displayName || "User"}</span>
            <Link
              className="btn"
              onClick={logout}
              to="/">
              Logout
            </Link>
          </div>
        </header>

        {/* Task Form */}
        <div className="p-4 flex justify-center">
          <form onSubmit={addTask} className="flex w-full max-w-md bg-white shadow-md rounded-md p-3">
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              className="flex-1 p-2 border rounded-md focus:outline-none"
              placeholder="Add a task..."
            />
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="ml-2 p-2 border rounded-md">
              <option value="todo">To do</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
            <button type="submit" className="ml-2 bg-blue-500 text-white px-3 py-2 rounded-md">+ Add</button>
          </form>
        </div>

        {/* Task Board */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <TaskColumn title="To Do" icon={todoIcon} status="todo" />
          <TaskColumn title="Doing" icon={doingIcon} status="doing" />
          <TaskColumn title="Done" icon={doneIcon} status="done" />
        </div>

        {/* Footer */}
        <footer className="bg-gray-800 text-white text-center py-4 mt-auto">
          <p>&copy; 2025 Task Manager. All rights reserved.</p>
        </footer>
      </div>
    </DndProvider>
  );
};

export default Home;
