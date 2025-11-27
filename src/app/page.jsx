"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const profileFetch = async () => {
      const res = await fetch("/api/profile");
      const data = await res.json();

      setName(data.user.name);
      setEmail(data.user.email);
    };

    const fetchTasks = async () => {
      const res = await fetch("/api/tasks");
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      setTasks(data.tasks || []);
      setLoading(false);
    };

    profileFetch();
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to create task");
      return;
    }

    setTasks((prev) => [data.task, ...prev]);

    setTitle("");
    setDescription("");
  };

  const handleDeleteTask = async (taskId) => {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to delete task");
      return;
    }

    setTasks((prev) => prev.filter((task) => task._id !== taskId));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <main className="grow max-w-6xl mx-auto w-full px-4 py-6 space-y-6">
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">Dashboard</h1>
            <p className="text-gray-600 text-sm md:text-base">
              Manage your profile and tasks from one place.
            </p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
            <h2 className="text-lg font-semibold mb-2">Profile Summary</h2>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Name</p>
                <p className="font-medium">{name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="font-medium">{email}</p>
              </div>
            </div>

            <Link
              href="/profile"
              className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-xl border text-sm font-medium hover:bg-gray-50"
            >
              Go to Profile
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
            <h2 className="text-lg font-semibold mb-2">Create New Task</h2>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Task title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Short description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                />
              </div>

              <button
                type="submit"
                className="w-full p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition cursor-pointer"
              >
                Add Task
              </button>
            </form>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-md p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <h2 className="text-lg font-semibold">Your Tasks</h2>

            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-full md:w-64 p-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select className="w-full md:w-40 p-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="border rounded-xl overflow-hidden">
            <div className="grid grid-cols-10 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-600">
              <div className="col-span-5">Title</div>
              <div className="col-span-3">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {tasks.map((task) => (
              <div
                key={task._id}
                className="grid grid-cols-10 px-4 py-3 border-t text-sm items-center"
              >
                <div className="col-span-5 flex gap-3">
                  <input
                    type="checkbox"
                    checked={task.status}
                    className="h-4 w-4 cursor-pointer accent-green-600 mt-1"
                  />

                  <div className="flex flex-col w-full">
                    <input
                      className="font-medium text-sm mb-1 w-full outline-none border-b border-transparent focus:border-gray-300"
                      value={task.title}
                      readOnly
                    />

                    {task.description && (
                      <input
                        className="text-xs text-gray-500 w-full outline-none border-b border-transparent focus:border-gray-300"
                        value={task.description}
                        readOnly
                      />
                    )}
                  </div>
                </div>

                <div className="col-span-3">
                  <span
                    className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${
                      task.status
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {task.status ? "Completed" : "Pending"}
                  </span>
                </div>

                <div className="col-span-2 flex justify-end gap-2">
                  <button className="px-3 py-1 text-xs rounded-lg border hover:bg-gray-50">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="px-3 py-1 text-xs rounded-lg border border-red-400 text-red-500 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
