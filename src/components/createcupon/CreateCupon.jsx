"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

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
            `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/get/coupon/${id}`
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
        ? `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/update/coupon/${id}`
        : `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/create/coupon`;

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
    <div className="w-full p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">
        {id ? "Update Coupon" : "Create Coupon"}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Row: Coupon Name, Code, Discount */}
        <div className="mb-2 flex flex-col md:flex-row gap-2">
          <Input
            name="name"
            placeholder="Coupon Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            name="cuponCode"
            placeholder="Code"
            value={form.cuponCode}
            onChange={handleChange}
            required
          />
          <Input
            type="number"
            name="discountPercentage"
            placeholder="Discount %"
            value={form.discountPercentage}
            onChange={handleChange}
            required
          />
        </div>

        {/* Row: Expiry Date + Active checkbox */}
        <div className="mb-4 flex flex-col md:flex-row items-center gap-4">
          <div className="flex-4 w-full ">
            <label className="block mb-1 text-sm text-gray-600">
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

        {/* Submit Button */}
        <Button
          type="submit"
          
          disabled={loading}
        >
          {loading ? "Processing..." : id ? "Update Coupon" : "Create Coupon"}
        </Button>
      </form>
    </div>
  );
};

export default CreateCoupon;
