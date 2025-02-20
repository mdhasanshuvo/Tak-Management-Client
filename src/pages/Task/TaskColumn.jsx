import React from "react";
import { useDrop } from "react-dnd";
import TaskCard from "./TaskCard";
import "./TaskColumn.css";

const TaskColumn = ({ title, icon, tasks, status, updateTaskStatus, handleDelete }) => {
  const [, drop] = useDrop({
    accept: "TASK",
    drop: (item) => updateTaskStatus(item.index, status),
  });

  return (
    <section className="task_column" ref={drop}>
      <h2 className="task_column_heading">
        <img className="task_column_icon" src={icon} alt="" /> {title}
      </h2>
      {tasks.map((task, index) =>
        task.status === status ? (
          <TaskCard key={index} index={index} title={task.task} tags={task.tags} handleDelete={handleDelete} />
        ) : null
      )}
    </section>
  );
};

export default TaskColumn;
