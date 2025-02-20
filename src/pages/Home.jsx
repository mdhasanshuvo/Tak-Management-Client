import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TaskForm from "./Task/TaskForm";
import TaskColumn from "./Task/TaskColumn";
import todoIcon from "../assets/direct-hit.png";
import doingIcon from "../assets/glowing-star.png";
import doneIcon from "../assets/check-mark-button.png";

const oldTasks = localStorage.getItem("tasks");

const Home = () => {
  const [tasks, setTasks] = useState(JSON.parse(oldTasks) || []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleDelete = (taskIndex) => {
    const newTasks = tasks.filter((_, index) => index !== taskIndex);
    setTasks(newTasks);
  };

  const updateTaskStatus = (taskIndex, newStatus) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      updatedTasks[taskIndex].status = newStatus;
      localStorage.setItem("tasks", JSON.stringify(updatedTasks)); // Save update
      return updatedTasks;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <TaskForm setTasks={setTasks} />
        <main className="app_main">
          <TaskColumn title="To do" icon={todoIcon} tasks={tasks} status="todo" updateTaskStatus={updateTaskStatus} handleDelete={handleDelete} />
          <TaskColumn title="Doing" icon={doingIcon} tasks={tasks} status="doing" updateTaskStatus={updateTaskStatus} handleDelete={handleDelete} />
          <TaskColumn title="Done" icon={doneIcon} tasks={tasks} status="done" updateTaskStatus={updateTaskStatus} handleDelete={handleDelete} />
        </main>
      </div>
    </DndProvider>
  );
};

export default Home;
