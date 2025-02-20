import React from "react";
import { useDrag } from "react-dnd";
import "./TaskCard.css";
import deleteIcon from "../../assets/delete.png";

const TaskCard = ({ title, tags, handleDelete, index }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <article className="task_card" ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <p className="task_text">{title}</p>
      <div className="task_card_bottom_line">
        <div className="task_delete" onClick={() => handleDelete(index)}>
          <img src={deleteIcon} className="delete_icon" alt="" />
        </div>
      </div>
    </article>
  );
};

export default TaskCard;
