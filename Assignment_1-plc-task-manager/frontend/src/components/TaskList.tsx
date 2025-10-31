import { type TaskItem } from "../api/tasksApi";
import React from "react";

type Props = {
  tasks: TaskItem[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function TaskList({ tasks, onToggle, onDelete }: Props) {
  if (!tasks.length) return <div>No tasks yet — add one!</div>;

  return (
    <ul className="task-list">
      {tasks.map((t) => (
        <li key={t.id} className="task-item">
          <input
            type="checkbox"
            checked={t.isCompleted}
            onChange={() => onToggle(t.id)}
          />
          <span
            style={{
              textDecoration: t.isCompleted ? "line-through" : "none",
              flex: 1,
              marginLeft: 8,
            }}
          >
            {t.description}
          </span>
          <button
            onClick={() => onDelete(t.id)}
            className="delete-btn"
            style={{ marginLeft: 8 }}
          >
            ❌
          </button>
        </li>
      ))}
    </ul>
  );
}
