import React from "react";
import { useDrag } from "react-dnd";
import axios from "axios";
import "./TaskCard.css";
import deleteIcon from "../../assets/delete.png";

const TaskCard = ({ task, refreshTasks }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task._id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleDelete = async () => {
    try {
      await axios.delete(`https://task-management-server-fmbfsfprz.vercel.app/tasks/${task._id}`);
      refreshTasks(); // টাস্ক ডিলিট হলে তালিকা রিফ্রেশ করো
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <article className="task_card" ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <p className="task_text">{task.task}</p>
      <div className="task_card_bottom_line">
        <div className="task_delete" onClick={handleDelete}>
          <img src={deleteIcon} className="delete_icon" alt="Delete" />
        </div>
      </div>
    </article>
  );
};

export default TaskCard;
