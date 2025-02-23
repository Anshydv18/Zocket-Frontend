"use client"
import NotificationBell from "@/componets/notificalbell";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/user/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (response.ok) {
                localStorage.removeItem("user_data"); 
                router.push("/");
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <div className="h-screen flex flex-col">
            {/* Navbar */}
            <nav className="fixed top-0 w-full bg-gray-900 text-white py-4 px-6 shadow-lg flex justify-between items-center">
                <div className="space-x-6">
                    <Link href="/dashboard" className="hover:underline">
                        Task Assigned
                    </Link>
                    <Link href="/dashboard/track-task" className="hover:underline">
                        Track Task
                    </Link>
                    <Link href="/dashboard/create-task" className="hover:underline">
                        Create Task
                    </Link>
                    <NotificationBell/>
                </div>

                <div className="flex flex-row space-x-2 mr-8 justify-center">
                
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                    Logout
                </button>
                </div>
            </nav>

           
            <main className="flex-1 mt-16 p-6">{children}</main>
        </div>
    );
}
