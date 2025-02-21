import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TaskForm from "./Task/TaskForm";
import TaskColumn from "./Task/TaskColumn";

import todoIcon from "../assets/direct-hit.png";
import doingIcon from "../assets/glowing-star.png";
import doneIcon from "../assets/check-mark-button.png";
import { AuthContext } from "../provider/AuthProvider";

const Home = () => {
  const { user } = useContext(AuthContext); 
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/tasks?email=${user.email}`); 
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <TaskForm refreshTasks={fetchTasks} />
        <main className="app_main">
          <TaskColumn title="To do" icon={todoIcon} tasks={tasks} status="todo" refreshTasks={fetchTasks} />
          <TaskColumn title="Doing" icon={doingIcon} tasks={tasks} status="doing" refreshTasks={fetchTasks} />
          <TaskColumn title="Done" icon={doneIcon} tasks={tasks} status="done" refreshTasks={fetchTasks} />
        </main>
      </div>
    </DndProvider>
  );
};

export default Home;
