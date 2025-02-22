import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { DndProvider, useDrop, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import todoIcon from "../assets/direct-hit.png";
import doingIcon from "../assets/glowing-star.png";
import doneIcon from "../assets/check-mark-button.png";
import deleteIcon from "../assets/delete.png";
import editIcon from "../assets/edit.png";
import { AuthContext } from "../provider/AuthProvider";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [status, setStatus] = useState("todo");
  const [editingTaskId, setEditingTaskId] = useState(null);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(`https://task-management-server-rust-seven.vercel.app/tasks?email=${user.email}`);
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
  
    if (editingTaskId) {
      // Edit existing task
      try {
        await axios.put(`https://task-management-server-rust-seven.vercel.app/tasks/${editingTaskId}`, {
          task: taskInput,
          status,
        });
        Swal.fire({
          title: 'Task Updated!',
          text: 'Your task has been updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        fetchTasks(); // Fetch tasks again after updating
      } catch (error) {
        console.error("Task update failed:", error);
      }
    } else {
      // Add new task
      try {
        const { data } = await axios.post("https://task-management-server-rust-seven.vercel.app/tasks", {
          task: taskInput,
          status,
          email: user.email,
        });
        if (data.insertedId) {
          fetchTasks();
          Swal.fire({
            title: 'Task Added!',
            text: 'Your new task has been added successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        }
      } catch (error) {
        console.error("Task creation failed:", error);
      }
    }
  
    setTaskInput("");
    setEditingTaskId(null); // Reset editing task ID
  };
  

  const TaskColumn = ({ title, icon, status }) => {
    const [, drop] = useDrop({
      accept: "TASK",
      drop: async (item) => {
        const updatedTasks = tasks.map(task => {
          if (task._id === item.id) {
            return { ...task, status }; // Update the status of the moved task
          }
          return task;
        });

        setTasks(updatedTasks);
        try {
          await axios.put(`https://task-management-server-rust-seven.vercel.app/tasks/${item.id}`, {
            status,
          });
          Swal.fire({
            title: 'Task Moved!',
            text: 'The task has been moved successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
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
        await axios.delete(`https://task-management-server-rust-seven.vercel.app/tasks/${task._id}`);
        fetchTasks();
        Swal.fire({
          title: 'Task Deleted!',
          text: 'The task has been deleted successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    };

    const editTask = () => {
      setTaskInput(task?.task);
      setEditingTaskId(task._id);
    };

    return (
      <div ref={drag} className={`p-3 bg-white shadow-md rounded-md flex justify-between items-center my-2 ${isDragging ? "opacity-50" : "opacity-100"}`}>
        <p className="text-sm font-medium">{task.task}</p>
        <div className="flex space-x-2">
          <button onClick={editTask} className="p-1 hover:bg-gray-200 rounded-full">
            <img src={editIcon} alt="Edit" className="w-4 h-4" />
          </button>
          <button onClick={deleteTask} className="p-1 hover:bg-gray-200 rounded-full">
            <img src={deleteIcon} alt="Delete" className="w-4 h-4" />
          </button>
        </div>
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
              maxLength="50"
            />
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="ml-2 p-2 border rounded-md">
              <option value="todo">To do</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
            <button type="submit" className="ml-2 bg-blue-500 text-white px-3 py-2 rounded-md">{editingTaskId ? 'Update' : '+ Add'}</button>
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
