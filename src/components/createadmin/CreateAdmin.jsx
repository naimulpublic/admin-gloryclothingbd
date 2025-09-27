"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import RoutePath from "@/custom/routepath/RoutePath";
import SubmitButton from "@/custom/submit/Submit";
import ImageUpload from "@/custom/image/Single";


const AdminUserForm = ({ id }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("general");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch data by id if provided
  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/admin/${id}`
          );
          const data = await res.json();
          if (res.ok) {
            setName(data.name);
            setEmail(data.email);
            setRole(data.role || "general"); // Set role if exists

            setPreviewImage(data.imageUrl); // For preview
          } else {
            console.error("Failed to load user data");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };

      fetchUser();
    }
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || (!id && !password)) {
      alert("Name, Email এবং Password (create এর সময়) বাধ্যতামূলক।");
      return;
    }

    if (!id && !image) {
      alert("Create এর সময় Image বাধ্যতামূলক।");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("adminRole", role);
    if (password) formData.append("password", password);
    if (image) formData.append("image", image);

    try {
      const url = id
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update/admin/${id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create/admin`;

      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert(
          data.message ||
            `Admin user ${id ? "updated" : "created"} successfully.`
        );

        if (!id) {
          // শুধু create এর পরে form reset করবো
          setName("");
          setEmail("");
          setPassword("");
          setRole("general");
          setImage(null);
          setPreviewImage(null);
        }
      } else {
        console.log("Error:", data.error);
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="px-4">
        <RoutePath />
      </div>
      <div className="w-full mt-4 p-4 bg-white">
        <h2 className=" text-sm md:text-lg font-medium text-center border py-1 lg:py-1.5 rounded-xs select-none bg-green-100 border-green-300">
          {id ? "Edit" : "Create New"} Admin
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="flex gap-2">
            <div className="w-[50%]">
              <div className="relative">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  type="text"
                  id="floating_name"
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label
                  htmlFor="floating_name"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Enter Admin Name <span className="text-red-500">*</span>
                </label>
              </div>
            </div>

            <div className="w-[50%]">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  id="floating_email"
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label
                  htmlFor="floating_email"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Enter Admin Email <span className="text-red-500">*</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="w-[70%] relative">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  {...(!id && { required: true })}
                  id="floating_pass"
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label
                  htmlFor="floating_pass"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Enter Admin Password <span className="text-red-500">*</span>
                </label>
              </div>

              <button
                type="button"
                className="absolute right-6 top-[25px] cursor-pointer -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="w-[30%] flex items-center mt-0">
              <Checkbox
                className="h-5 w-5 cursor-pointer"
                checked={role === "root"}
                onCheckedChange={(checked) => {
                  setRole(checked ? "root" : "general");
                }}
              />
              <span className="ml-2">
                {role === "root" ? "Root Admin" : "General Admin"}
              </span>
            </div>
          </div>

          <section className="flex items-center">
            <ImageUpload image={image} setImage={setImage} />
          </section>

          <SubmitButton id={id} isLoading={loading} name = "Admin" />
        </form>
      </div>
    </>
  );
};

export default AdminUserForm;
