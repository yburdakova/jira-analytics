"use client";

import { ProjectsProvider } from "@/context/ProjectsContext";
import Sidebar from "@/components/Sidebar";
import "./globals.css";
import Header from "@/components/Header";
import { ProjectProvider } from "@/context/ProjectContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <ProjectsProvider>
          <ProjectProvider>
            <Header/>
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 p-4 relative">{children}</main>
            </div>
            <footer className="border-t-2 text-center p-4  border-gray-200">
              <div className="container mx-auto">
                Copyright © {new Date().getFullYear()} Courthouse Computer Systems
              </div>
            </footer>
            </ProjectProvider>
        </ProjectsProvider>
      </body>
    </html>
  );
}
