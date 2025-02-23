"use client";
import Image from "next/image";
import MainImage from '../../public/MainImage.jpg';
import { useState } from "react";
import { useRouter } from "next/navigation"; 

interface LoginData {
  email: string;
  password: string;
}

export default function Home() {
  const router = useRouter();  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) { 
        localStorage.setItem("user_data", JSON.stringify(data.UserData));

        router.push("/dashboard");
      } else {
        console.error("Login failed:", data.error);
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen">
      <Image
        src={MainImage}
        alt="Main Background"
        layout="fill"
        objectFit="cover"
        quality={100}
      />
      <div className="absolute bottom-8 right-8 flex flex-col items-center justify-center w-96 mx-auto">
        <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
          <h1 className="text-3xl font-semibold text-center text-gray-300">
            Login <span className="text-blue-500">Todo</span>
          </h1>
          <form>
            <div>
              <label className="label p-2">
                <span className="text-base label-text text-blue-500">Username</span>
              </label>
              <input
                type="text"
                placeholder="Enter Username"
                className="w-full input input-bordered h-10"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="label p-2">
                <span className="text-base label-text text-blue-500">Password</span>
              </label>
              <input
                type="password"
                placeholder="Password"
                className="w-full input input-bordered h-10"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="mb-12 text-center w-full">
              {loading ? (
                <div className="loading loading-spinner loading-md" />
              ) : (
                <button
                  className="btn btn-block btn-sm w-full mt-2 h-10 text-blue-500 hover:bg-blue-500 hover:text-white"
                  onClick={handleSubmit}
                >
                  Login
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
