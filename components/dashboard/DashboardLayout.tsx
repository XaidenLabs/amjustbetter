"use client";

import { Sidebar } from "./Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 relative overflow-hidden">
            {/* Background Ambient Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/10 blur-[100px]"></div>
            </div>

            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-50">
                <Sidebar />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-20 md:ml-64 p-6 relative z-10 transition-all duration-300">
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6 shadow-2xl min-h-[calc(100vh-3rem)] text-white">
                    {children}
                </div>
            </main>
        </div>
    );
}
