import React, { useState } from "react";

type Props = {
  onAdd: (description: string) => void;
};

export default function TaskForm({ onAdd }: Props) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = text.trim();
    if (!val) return;
    onAdd(val);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a task..."
        className="task-input"
      />
      <button type="submit" className="add-btn">Add</button>
    </form>
  );
}
