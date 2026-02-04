import React, { useState } from "react";
import { UserPlus, Mail, Lock, Shield, Image } from "lucide-react";

const UserManagement = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Doctor",
    specialty: "",
    ward: "",
    imageUrl: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Success: User added successfully!");
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "Doctor",
          specialty: "",
          ward: "",
          imageUrl: "",
        });
      } else {
        setMessage("Error: " + data.message);
      }
    } catch (err) {
      setMessage("Error: Server connection failed.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          User Management
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Create and manage access credentials for hospital staff.
        </p>
      </div>

      <div className="p-8 bg-white border border-blue-300 shadow-sm dark:bg-slate-800 rounded-2xl dark:border-blue-700 shadow-blue-200/50 dark:shadow-blue-900/20">
        <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-100 dark:border-slate-700">
          <div className="p-3 text-blue-600 bg-blue-100 rounded-xl">
            <UserPlus size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Register New Staff
            </h2>
            <p className="text-sm text-slate-500">
              Add a new Doctor, Nurse, or Admin to the system.
            </p>
          </div>
        </div>

        {message && (
          <div
            className={`p-4 mb-6 rounded-xl text-sm font-bold ${message.includes("Error") ? "bg-red-50 text-red-600 border border-red-200" : "bg-green-50 text-green-600 border border-green-200"}`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Dr. John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 transition-all border outline-none rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="john@medvault.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full py-3 pr-4 transition-all border outline-none pl-11 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full py-3 pr-4 transition-all border outline-none pl-11 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Role
              </label>
              <div className="relative">
                <Shield
                  className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400"
                  size={18}
                />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full py-3 pr-4 transition-all border outline-none appearance-none pl-11 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Doctor">Doctor</option>
                  <option value="Nurse">Nurse</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Profile Image URL (Optional)
              </label>
              <div className="relative">
                <Image
                  className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  name="imageUrl"
                  placeholder="https://..."
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full py-3 pr-4 transition-all border outline-none pl-11 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {formData.role === "Doctor" && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Specialty
                </label>
                <input
                  type="text"
                  name="specialty"
                  placeholder="e.g. Cardiology"
                  value={formData.specialty}
                  onChange={handleChange}
                  className="w-full px-4 py-3 transition-all border outline-none rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {formData.role === "Nurse" && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Assigned Ward
                </label>
                <input
                  type="text"
                  name="ward"
                  placeholder="e.g. ICU - Wing A"
                  value={formData.ward}
                  onChange={handleChange}
                  className="w-full px-4 py-3 transition-all border outline-none rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
            >
              Create User Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;
