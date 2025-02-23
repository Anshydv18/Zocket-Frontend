"use client";
import { useEffect, useState } from "react";
import { WebSocketProvider } from "@/context/websocketContext";

export default function WebSocketWrapper({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    // Read user data from localStorage
    const storedUser = localStorage.getItem("user_data");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserId(parsedUser?.Email || ""); // Extract email as userId
      } catch (error) {
        console.error("Error parsing user data from localStorage", error);
      }
    }
  }, []);

  return <WebSocketProvider userId={userId}>{children}</WebSocketProvider>;
}
