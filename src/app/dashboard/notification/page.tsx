"use client";
import { useEffect, useState } from "react";

export default function Notifications({ userId }: { userId: string }) {
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8000/api/v1/ws?user_id=${userId}`);

        socket.onmessage = (event) => {
            setMessages((prev) => [...prev, event.data]);
        };

        socket.onclose = () => console.log("WebSocket Disconnected");

        return () => socket.close();
    }, [userId]);

    return (
        <div className="fixed bottom-5 right-5 p-4 bg-gray-200 rounded shadow">
            <h3 className="font-bold">Notifications</h3>
            {messages.map((msg, index) => (
                <p key={index} className="text-sm">{msg}</p>
            ))}
        </div>
    );
}
