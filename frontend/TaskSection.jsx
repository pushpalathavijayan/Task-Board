import React, {
  useEffect,
  useState,
  useContext,
  useCallback
} from "react";
import api from "../api.js";
import { AuthContext } from "../context/AuthContext.jsx";

export default function TaskSection() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const token = user?.token;

  // Load tasks
  const load = useCallback(async () => {
    if (!token) return;

    try {
      const res = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Error loading tasks:", err);
    }
  }, [token]);

  // Initial load
  useEffect(() => {
    load();
  }, [load]);

  // Add task
  const add = useCallback(
    async (e) => {
      e.preventDefault();
      if (!title.trim() || !token) return;

      try {
        await api.post(
          "/tasks",
          { title },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setTitle("");
        load();
      } catch (err) {
        console.error("Error adding task:", err);
      }
    },
    [title, token, load]
  );

  // Toggle completed
  const toggle = useCallback(
    async (task) => {
      if (!token) return;

      try {
        await api.put(
          `/tasks/${task._id}`,
          {
            isCompleted: !task.isCompleted,
            title: task.title
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        load();
      } catch (err) {
        console.error("Error toggling task:", err);
      }
    },
    [token, load]
  );

  // Delete task
  const remove = useCallback(
    async (id) => {
      const confirmed = window.confirm("Delete this task?");
      if (!confirmed || !token) return;

      try {
        await api.delete(`/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        load();
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    },
    [token, load]
  );

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-xl font-semibold mb-3">Tasks</h3>

      {/* ADD TASK */}
      <form onSubmit={add} className="flex gap-2 mb-4">
        <input
          className="flex-1 border p-2 rounded"
          placeholder="New task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </form>

      {/* TASK LIST */}
      <div className="space-y-2">
        {tasks.map((t) => (
          <div
            key={t._id}
            className="flex items-center justify-between p-2 border rounded"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={!!t.isCompleted}
                onChange={() => toggle(t)}
              />

              <div
                className={
                  t.isCompleted
                    ? "line-through text-gray-500"
                    : ""
                }
              >
                {t.title}
              </div>
            </div>

            <button
              className="text-sm text-red-500"
              onClick={() => remove(t._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
