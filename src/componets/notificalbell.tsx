"use client";
import { useWebSocket } from "@/context/websocketContext";
import { useState } from "react";

export default function NotificationBell() {
    const { messages } = useWebSocket();
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div className="relative">
            <button onClick={() => setShowDropdown(!showDropdown)} className="relative">
                🔔
                {messages.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-black text-xs rounded-full px-2">
                        {messages.length}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 text-green-600 shadow-md rounded-md p-4 bg-black">
                    <h3 className="font-bold text-black">Notifications</h3>
                    {messages.length === 0 ? (
                        <p>No new notifications</p>
                    ) : (
                        messages.map((msg, index) => (
                            <p key={index} className="text-sm border-b py-1">{msg}</p>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
