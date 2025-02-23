"use client";
import { useState } from "react";

interface Task {
    id?: string;
    title: string;
    description: string;
    deadline: string;
    priority: string;
    progress: string;
    assigneeEmail: string;
    created_by?: string;
}

export default function TaskForm({ onTaskAdded = () => {} }: { onTaskAdded?: (task: Task) => void }) {
    const [taskData, setTaskData] = useState<Task>({
        title: "",
        description: "",
        deadline: "",
        priority: "Low",
        progress: "Todo",
        assigneeEmail: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setTaskData({ ...taskData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const storedData = localStorage.getItem("user_data");
        const userData = JSON.parse(storedData || "{}");

        const updatedTask = {
            ...taskData,
            created_by: userData?.Email || "unknown",
            deadline: new Date(taskData.deadline).toISOString(),
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/p1/createTask`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(updatedTask),
            });

            if (!response.ok) {
                throw new Error("Failed to create task");
            }

            const newTask = await response.json();
            onTaskAdded(newTask);

            // Reset form
            setTaskData({
                title: "",
                description: "",
                deadline: "",
                priority: "Low",
                progress: "Todo",
                assigneeEmail: "",
            });

            alert("Task Created Successfully!");
        } catch (error) {
            console.error("Error creating task:", error);
            alert("Failed to create task.");
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                {/* Title */}
                <div className="flex items-center space-x-2">
                    <label className="w-24">Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={taskData.title}
                        onChange={handleInputChange}
                        className="border p-2 rounded flex-1"
                        required
                    />
                </div>

                {/* Description */}
                <div className="flex items-center space-x-2">
                    <label className="w-24">Description:</label>
                    <textarea
                        name="description"
                        value={taskData.description}
                        onChange={handleInputChange}
                        className="border p-2 rounded flex-1"
                        required
                    ></textarea>
                </div>

                {/* Deadline */}
                <div className="flex items-center space-x-2">
                    <label className="w-24">Deadline:</label>
                    <input
                        type="date"
                        name="deadline"
                        value={taskData.deadline}
                        onChange={handleInputChange}
                        className="border p-2 rounded flex-1"
                        required
                    />
                </div>

                {/* Priority */}
                <div className="flex items-center space-x-2">
                    <label className="w-24">Priority:</label>
                    <select
                        name="priority"
                        value={taskData.priority}
                        onChange={handleInputChange}
                        className="border p-2 rounded flex-1"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>

                {/* Progress */}
                <div className="flex items-center space-x-2">
                    <label className="w-24">Progress:</label>
                    <select
                        name="progress"
                        value={taskData.progress}
                        onChange={handleInputChange}
                        className="border p-2 rounded flex-1"
                    >
                        <option value="Todo">Todo</option>
                        <option value="InProgress">In Progress</option>
                        <option value="Complete">Complete</option>
                    </select>
                </div>

                {/* Assignee Email */}
                <div className="flex items-center space-x-2">
                    <label className="w-24">Assignee Email:</label>
                    <input
                        type="email"
                        name="assigneeEmail"
                        value={taskData.assigneeEmail}
                        onChange={handleInputChange}
                        className="border p-2 rounded flex-1"
                        required
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Create Task
                    </button>
                </div>
            </form>
        </div>
    );
}
