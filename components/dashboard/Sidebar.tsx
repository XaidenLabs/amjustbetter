"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Home,
    Ruler,
    LineChart,
    TrendingDown,
    FileText,
    LogOut,
    Leaf,
    ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await api.post("/logout");
            localStorage.removeItem("token");
            router.push("/login"); // Redirect to login after logout
        } catch (error) {
            console.error("Logout failed:", error);
            // Even if API call fails, clear local storage and redirect
            localStorage.removeItem("token");
            router.push("/login");
        }
    };

    const navItems = [
        { name: "Home", href: "/dashboard/user", icon: Home },
        { name: "Measure", href: "/dashboard/measure", icon: Ruler },
        { name: "Analyze", href: "/dashboard/analyze", icon: LineChart },
        { name: "Reduce", href: "/dashboard/reduce", icon: TrendingDown },
        { name: "Report", href: "/dashboard/report", icon: FileText },
    ];

    return (
        <div className="h-screen w-20 md:w-64 flex flex-col justify-between p-4 transition-all duration-300 relative group">
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl -z-10 mx-2 my-2"></div>

            {/* Header / Logo */}
            <div className="flex items-center justify-center md:justify-start px-2 py-6 space-x-2">
                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm shadow-inner group-hover:scale-105 transition-transform">
                    <Leaf className="w-6 h-6 text-white drop-shadow-md" />
                </div>
                <span className="hidden md:block font-bold text-white tracking-wide drop-shadow-md">AmJustBetter</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col space-y-2 mt-4 px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center p-3 rounded-2xl transition-all duration-300 group/item relative overflow-hidden
                ${isActive
                                    ? "bg-white text-emerald-900 shadow-lg font-bold translate-x-1"
                                    : "text-white/80 hover:bg-white/10 hover:text-white hover:shadow-md hover:translate-x-1"
                                }`}
                        >
                            <item.icon className={`w-6 h-6 ${isActive ? "text-emerald-900" : "text-white"} drop-shadow-sm`} />
                            <span className="hidden md:block ml-3 font-medium">{item.name}</span>

                            {/* Active Indicator for mobile */}
                            {isActive && (
                                <div className="absolute left-0 bottom-0 top-0 w-1 bg-emerald-500 rounded-r-md md:hidden"></div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Sidebar Controls */}
            <div className="px-2 pb-4 space-y-4">
                {/* Toggle Button (Visual only for now matching design) */}
                <div className="hidden md:flex justify-end pr-2">
                    <button className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full backdrop-blur-sm transition-colors text-white/80 hover:text-white">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                </div>

                {/* Logout Button */}
                <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="w-full flex items-center justify-center md:justify-start p-3 rounded-2xl text-white/80 hover:bg-red-500/20 hover:text-red-100 hover:shadow-lg transition-all border border-transparent hover:border-red-500/30"
                >
                    <LogOut className="w-6 h-6" />
                    <span className="hidden md:block ml-3 font-medium">Logout</span>
                </Button>
            </div>
        </div>
    );
}
