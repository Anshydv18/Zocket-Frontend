"use client";
import { createContext, useContext, useEffect, useState } from "react";

const WebSocketContext = createContext<{ messages: string[] }>({ messages: [] });

export const WebSocketProvider = ({ userId, children }: { userId: string; children: React.ReactNode }) => {
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        if (!userId) return;

        const socket = new WebSocket(`ws://localhost:8000/api/v1/ws?user_id=${userId}`);

        socket.onmessage = (event) => {
            setMessages((prev) => [...prev, event.data]);
        };

        socket.onclose = () => console.log("WebSocket Disconnected");

        return () => socket.close();
    }, [userId]);

    return <WebSocketContext.Provider value={{ messages }}>{children}</WebSocketContext.Provider>;
};

export const useWebSocket = () => useContext(WebSocketContext);
