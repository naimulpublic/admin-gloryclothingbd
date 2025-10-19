"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { SquarePlus } from "lucide-react";
import { Loader } from "lucide-react";
import RoutePath from "@/custom/routepath/RoutePath";
import SubmitButton from "@/custom/submit/Submit";

const CreateCoupon = ({ id }) => {
  // <-- এখানে id props নিচ্ছি
  const [form, setForm] = useState({
    name: "",
    cuponCode: "",
    discountPercentage: "",
    expiryDate: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);

  // 👇 যদি id আসে তাহলে ডেটা ফেচ করে form পুরন করে দিবে
  useEffect(() => {
    const fetchCoupon = async () => {
      if (id) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get/coupon/${id}`
          );
          const data = await res.json();
          if (res.ok) {
            setForm({
              name: data.name || "",
              cuponCode: data.cuponCode || "",
              discountPercentage: data.discountPercentage || "",
              expiryDate: data.expiryDate?.slice(0, 10) || "", // যদি ডেটার মধ্যে টাইম থাকে
              isActive: data.isActive ?? true,
            });
          }
        } catch (err) {
          console.error("Failed to fetch coupon data", err);
        }
      }
    };

    fetchCoupon();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = id
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update/coupon/${id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/create/coupon`;

      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert(
          id ? "Coupon updated successfully." : "Coupon created successfully."
        );

        if (!id) {
          // শুধু create এর পরে form reset করবো
          setForm({
            name: "",
            cuponCode: "",
            discountPercentage: "",
            expiryDate: "",
            isActive: true,
          });
        }
      } else {
        console.error(data);
      }
    } catch (err) {
      console.error("Something went wrong", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4 pb-48 bg-white shadow-sm rounded-sm">
      <RoutePath />
      <h2 className=" text-sm md:text-lg font-medium text-center border py-1 lg:py-1.5 rounded-xs select-none bg-green-100 border-green-300">
        {id ? "Edit" : "Create New"} Cupon
      </h2>

      <form className="mt-4" onSubmit={handleSubmit}>
                <div className="mb-2 md:flex w-full gap-2">
          <div className="relative md:w-[33.33%] mb-2 md:mb-0">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              id="floating_name"
              className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="floating_name"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
             Enter Name <span className="text-red-600">*</span>
            </label>
          </div>
          <div className="relative md:w-[33.33%] mb-2 md:mb-0">
            <input
              name="cuponCode"
              type="text"
              value={form.cuponCode}
              onChange={handleChange}
              required
              id="floating_code"
              className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="floating_code"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Enter Code <span className="text-red-600">*</span>
            </label>
          </div>
          <div className="relative md:w-[33.33%]">
            <input
              name="discountPercentage"
              type="number"
              value={form.discountPercentage}
              onChange={handleChange}
              required
              id="floating_per"
              className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="floating_per"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Enter Persentage<span className="text-red-600">*</span>
            </label>
          </div>
        </div>

        {/* Row: Expiry Date + Active checkbox */}
        <div className="mb-4 flex flex-col md:flex-row items-center gap-4">
          <div className="flex-4 w-full ">
            <label className="block mb-1 text-sm text-gray-600 p-1.5 border-b">
              Expiry Date
            </label>
            <Input
              type="date"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-2 items-center gap-2 mt-6">
            <Checkbox
              checked={form.isActive}
              onCheckedChange={(checked) =>
                setForm((prev) => ({
                  ...prev,
                  isActive: checked,
                }))
              }
            />
            <label className="text-sm text-gray-700">Active</label>
          </div>
        </div>

        <SubmitButton id={id} isLoading={loading} name="Coupon" />
      </form>
    </div>
  );
};

export default CreateCoupon;
