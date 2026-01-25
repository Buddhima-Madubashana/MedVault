import React, { useState } from "react";

const UserManagement = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Doctor", // Default
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
        setMessage("User added successfully!");
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
      setMessage("Server Error");
    }
  };

  return (
    <div className="max-w-2xl p-6 mx-auto bg-white rounded-lg shadow dark:bg-zinc-800">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">
        User Management
      </h1>

      {message && (
        <div
          className={`p-4 mb-4 rounded ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="p-2 border rounded dark:bg-zinc-900 dark:text-white"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="p-2 border rounded dark:bg-zinc-900 dark:text-white"
          />
        </div>

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded dark:bg-zinc-900 dark:text-white"
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="p-2 border rounded dark:bg-zinc-900 dark:text-white"
          >
            <option value="Doctor">Doctor</option>
            <option value="Nurse">Nurse</option>
            <option value="Admin">Admin</option>
          </select>
          <input
            type="text"
            name="imageUrl"
            placeholder="Profile Image URL"
            value={formData.imageUrl}
            onChange={handleChange}
            className="p-2 border rounded dark:bg-zinc-900 dark:text-white"
          />
        </div>

        {formData.role === "Doctor" && (
          <input
            type="text"
            name="specialty"
            placeholder="Specialty (e.g. Cardiology)"
            value={formData.specialty}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-zinc-900 dark:text-white"
          />
        )}

        {formData.role === "Nurse" && (
          <input
            type="text"
            name="ward"
            placeholder="Assigned Ward"
            value={formData.ward}
            onChange={handleChange}
            className="w-full p-2 border rounded dark:bg-zinc-900 dark:text-white"
          />
        )}

        <button
          type="submit"
          className="w-full py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Create User
        </button>
      </form>
    </div>
  );
};

export default UserManagement;
