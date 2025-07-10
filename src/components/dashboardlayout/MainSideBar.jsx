import React from "react";
import SideBar from "./clients/SideBar";
import Header from "./Header";

export default function MaiDashboardLayout({ children }) {
  return (
    <section className="flex min-h-screen bg-gray-300 text-gray-800 font-sans">
      {/* Sidebar */}
      <aside className="bg-bgaside full">
        <SideBar />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col w-full max-h-screen overflow-hidden">
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto scrollbar  scrollbar-thumb-orange-500 scrollbar-track-gray-200 bg-bgbody">
          {children}
        </main>
      </div>
    </section>
  );
}
