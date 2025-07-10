"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";

const AdminUserForm = ({ id }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Fetch data by id if provided
  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/get/admin/${id}`
          );
          const data = await res.json();
          if (res.ok) {
            setName(data.name);
            setEmail(data.email);
            setIsActive(data.isActive);
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
      alert("Name, Email এবং Password (create করার সময়) বাধ্যতামূলক।");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (password) formData.append("password", password);
    if (image) formData.append("image", image);
    formData.append("isActive", isActive.toString());

    try {
      const url = id
        ? `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/update/admin/${id}`
        : `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/create/admin`;

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
    <div className="w-full mt-4 p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-xl font-medium text-center mb-6 text-gray-800 border-b pb-2">
        {id ? "Update Admin User" : "Create Admin User"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <div className="w-[50%]">
            <label className="block text-sm font-medium text-gray-700">
              Name:
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="w-[50%]">
            <label className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="w-[80%] relative">
            <label className="block text-sm font-medium text-gray-700">
              Password:
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={id ? "Leave blank to keep old password" : ""}
              required
            />
            <button
              type="button"
              className="absolute right-4 top-[38px] cursor-pointer -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex w-[30%] items-center space-x-2 mt-2">
            <Checkbox
              className="cursor-pointer h-5 w-5"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(checked)}
            />

            <label htmlFor="isActive" className="text-sm text-gray-700">
              {isActive ? "Active Admin" : "Inactive Admin"}
            </label>
          </div>
        </div>

        <section className="flex items-center">
          <div className="w-[60%]">
            <Input type="file" onChange={handleImageChange} />
          </div>
          <div className="w-[40%] flex items-center justify-center">
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-3 h-24 rounded object-cover border"
              />
            )}
          </div>
        </section>

        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : id ? "Update Admin" : "Create Admin"}
        </Button>
      </form>
    </div>
  );
};

export default AdminUserForm;
