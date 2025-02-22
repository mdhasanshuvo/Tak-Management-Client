import React from "react";
import { useDrop } from "react-dnd";
import axios from "axios";
import TaskCard from "./TaskCard";
import "./TaskColumn.css";

const TaskColumn = ({ title, icon, tasks, status, refreshTasks }) => {
  const [, drop] = useDrop({
    accept: "TASK",
    drop: async (item) => {
      try {
        await axios.put(`https://task-management-server-fmbfsfprz.vercel.app/tasks/${item.id}`, { status });
        refreshTasks();
      } catch (error) {
        console.error("Failed to update task status:", error);
      }
    },
  });

  return (
    <section className="task_column" ref={drop}>
      <h2 className="task_column_heading">
        <img className="task_column_icon" src={icon} alt="" /> {title}
      </h2>
      {tasks.map((task) =>
        task.status === status ? (
          <TaskCard key={task._id} task={task} refreshTasks={refreshTasks} />
        ) : null
      )}
    </section>
  );
};

export default TaskColumn;
