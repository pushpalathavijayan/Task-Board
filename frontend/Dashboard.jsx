import React, { useContext } from "react";
import TaskSection from "../components/TaskSection.jsx";
import ChatSection from "../components/ChatSection.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <header className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">TaskBoard</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm">Signed in as <strong>{user?.username}</strong></div>
          <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <TaskSection />
        </section>

        <aside>
          <ChatSection />
        </aside>
      </main>
    </div>
  );
}
