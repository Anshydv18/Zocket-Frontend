"use client";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface Task {
    id: string;
    title: string;
    description: string;
    deadline: string;
    priority: string;
    progress: string;
    assigneeEmail: string;
    created_by: string;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const pathName = usePathname();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    useEffect(() => {
        const FetchPost = async () => {
            try {
                const storedData = localStorage.getItem("user_data");
                const userData = storedData ? JSON.parse(storedData) : null;

                if (!userData || !userData.Email) {
                    console.error("User data is missing or invalid.");
                    return;
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/p1/fetchAllTask`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        string: userData.Email
                    })
                });

                if (!response.ok) {
                    throw new Error("Error fetching data");
                }

                const data = await response.json();
                setTasks(data.assigned_tasks || []);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        FetchPost();
    }, [pathName]);

  
    const handleEditClick = (task: Task) => {
        setSelectedTask(task);
        setIsEditModalOpen(true);
    };

   
    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setSelectedTask(null);
    };

    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!selectedTask) return;
        setSelectedTask({ ...selectedTask, [e.target.name]: e.target.value });
    };


    const handleUpdateTask = async () => {
        if (!selectedTask) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/p1/updateTask`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(selectedTask),
            });

            if (!response.ok) {
                throw new Error("Failed to update task");
            }

           
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === selectedTask.id ? selectedTask : task
                )
            );
            handleCloseModal();
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Task List</h1>

           
            {tasks.length > 0 ? (
                <ul className="flex space-y-4">
                    {tasks.map((task) => (
                        <li key={task.id} className="border p-4 rounded-lg shadow-md bg-white flex justify-between w-1/2">
                            <div>
                                <h2 className="text-lg font-semibold">{task.title}</h2>
                                <p className="text-gray-600">{task.description}</p>
                                <p><strong>Priority:</strong> {task.priority}</p>
                                <p><strong>Progress:</strong> {task.progress}</p>
                                <p><strong>Deadline:</strong> {task.deadline}</p>
                                <p><strong>Assigned to:</strong> {task.assigneeEmail}</p>
                                <p><strong>Created by:</strong> {task.created_by}</p>
                            </div>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={() => handleEditClick(task)}
                            >
                                Edit
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No tasks assigned.</p>
            )}

            {children}

           
            {isEditModalOpen && selectedTask && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Edit Task</h2>

                        <div className="space-y-3">
                            {/* Title */}
                            <div className="flex items-center space-x-2">
                                <label className="w-24">Title:</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={selectedTask.title}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded flex-1"
                                />
                            </div>

                            {/* Description */}
                            <div className="flex items-center space-x-2">
                                <label className="w-24">Description:</label>
                                <textarea
                                    name="description"
                                    value={selectedTask.description}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded flex-1"
                                ></textarea>
                            </div>

                            {/* Deadline */}
                            <div className="flex items-center space-x-2">
                                <label className="w-24">Deadline:</label>
                                <input
                                    type="text"
                                    name="deadline"
                                    value={selectedTask.deadline}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded flex-1"
                                />
                            </div>

                            {/* Priority (Dropdown) */}
                            <div className="flex items-center space-x-2">
                                <label className="w-24">Priority:</label>
                                <select
                                    name="priority"
                                    value={selectedTask.priority}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded flex-1"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>

                            {/* Progress (Dropdown) */}
                            <div className="flex items-center space-x-2">
                                <label className="w-24">Progress:</label>
                                <select
                                    name="progress"
                                    value={selectedTask.progress}
                                    onChange={handleInputChange}
                                    className="border p-2 rounded flex-1"
                                >
                                    <option value="Todo">Todo</option>
                                    <option value="InProgress">In Progress</option>
                                    <option value="Complete">Complete</option>
                                </select>
                            </div>
                        </div>

                       
                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                onClick={handleCloseModal}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateTask}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
