"use client";

import { ProjectsProvider } from "@/context/ProjectsContext";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <ProjectsProvider>
          <header className="p-4 border-b-2  border-gray-200">
            <div className="container mx-auto">
              <h1 className="text-2xl font-bold">Jira Analytics</h1>
            </div>
          </header>

          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-4">{children}</main>
          </div>

          <footer className="border-t-2 text-center p-4  border-gray-200">
            <div className="container mx-auto">
              Copyright © {new Date().getFullYear()} Courthouse Computer Systems
            </div>
          </footer>
        </ProjectsProvider>
      </body>
    </html>
  );
}
