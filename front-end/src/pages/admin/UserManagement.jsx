import React, { useState, useRef } from "react";
import { UserPlus, Mail, Lock, Shield, Upload, Camera, X, Stethoscope, Building2 } from "lucide-react";

const DOCTOR_SPECIALTIES = [
  "Cardiology",
  "Dermatology",
  "Emergency Medicine",
  "Endocrinology",
  "Gastroenterology",
  "General Surgery",
  "Geriatrics",
  "Hematology",
  "Infectious Disease",
  "Internal Medicine",
  "Nephrology",
  "Neurology",
  "Neurosurgery",
  "Obstetrics & Gynecology",
  "Oncology",
  "Ophthalmology",
  "Orthopedics",
  "Otolaryngology (ENT)",
  "Pathology",
  "Pediatrics",
  "Physical Medicine & Rehabilitation",
  "Plastic Surgery",
  "Psychiatry",
  "Pulmonology",
  "Radiology",
  "Rheumatology",
  "Urology",
  "Vascular Surgery",
];

const NURSE_WARDS = [
  "Cardiology Ward",
  "Emergency Department",
  "General Medicine Ward",
  "Geriatrics Ward",
  "ICU — Wing A",
  "ICU — Wing B",
  "Maternity Ward",
  "Neonatal ICU (NICU)",
  "Neurology Ward",
  "Oncology Ward",
  "Operating Theatre",
  "Orthopedics Ward",
  "Outpatient Department",
  "Pediatrics Ward",
  "Psychiatric Ward",
  "Recovery Room",
  "Surgical Ward",
];
import Notification from "../../components/Notification";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";

const UserManagement = () => {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Doctor",
    specialty: "",
    ward: "",
    imageUrl: "",
  });

  if (user?.isTempAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center bg-white/80 backdrop-blur-md dark:bg-slate-900/80 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-soft mt-8">
        <ShieldOff size={64} className="text-slate-300 dark:text-slate-600 mb-6" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Access Denied</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">
          As a temporary administrator, you do not have permission to register or add new users.
        </p>
      </div>
    );
  }

  const [notification, setNotification] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setNotification({
        type: "warning",
        title: "File Too Large",
        message: "Please select an image under 5MB.",
      });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData({ ...formData, imageUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImagePreview(null);
    setFormData({ ...formData, imageUrl: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        setNotification({
          type: "success",
          title: "User Created",
          message: `${formData.role} account added successfully.`,
        });
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "Doctor",
          specialty: "",
          ward: "",
          imageUrl: "",
        });
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setNotification({
          type: "error",
          title: "Registration Failed",
          message: data.message,
        });
      }
    } catch (err) {
      setNotification({
        type: "error",
        title: "Network Error",
        message: "Server connection failed.",
      });
    }
  };

  const inputClass =
    "w-full px-4 py-3 text-sm transition-all border outline-none rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary-500 dark:text-white placeholder-slate-400 dark:placeholder-slate-500";
  const inputWithIconClass =
    "w-full py-3 pr-4 pl-11 text-sm transition-all border outline-none rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary-500 dark:text-white placeholder-slate-400 dark:placeholder-slate-500";
  const selectWithIconClass =
    "w-full py-3 pr-4 pl-11 text-sm transition-all border outline-none rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary-500 dark:text-white appearance-none cursor-pointer";

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

      <div className="p-8 bg-white/80 backdrop-blur-md border shadow-soft dark:bg-slate-900/80 rounded-3xl border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="p-3 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 rounded-xl border border-primary-100 dark:border-primary-800/50">
            <UserPlus size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Register New Staff
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Add a new Doctor, Nurse, or Admin to the system.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Photo upload + Name/Email */}
          <div className="flex flex-col items-start gap-8 md:flex-row">
            {/* Photo Upload */}
            <div className="flex flex-col items-center space-y-3 shrink-0">
              <div
                className="relative w-28 h-28 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-slate-50 dark:border-slate-700 shadow-sm overflow-hidden cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full text-slate-300 dark:text-slate-600">
                    <Camera size={28} />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload size={22} className="text-white" />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {imagePreview ? (
                <button
                  type="button"
                  onClick={clearImage}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                >
                  <X size={12} /> Remove
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/40 rounded-lg transition-colors"
                >
                  Upload Photo
                </button>
              )}
            </div>

            {/* Name + Email */}
            <div className="flex-1 w-full space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400 dark:text-slate-500"
                      size={18}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="john@medvault.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={inputWithIconClass}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400 dark:text-slate-500"
                      size={18}
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={inputWithIconClass}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Role
                  </label>
                  <div className="relative">
                    <Shield
                      className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400 dark:text-slate-500"
                      size={18}
                    />
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className={inputWithIconClass + " appearance-none cursor-pointer"}
                    >
                      <option value="Doctor">Doctor</option>
                      <option value="Nurse">Nurse</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Specialty / Ward */}
          {formData.role === "Doctor" && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Specialty
              </label>
              <div className="relative">
                <Stethoscope
                  className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400 dark:text-slate-500"
                  size={18}
                />
                <select
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  className={selectWithIconClass}
                >
                  <option value="" disabled>
                    Select a specialty…
                  </option>
                  {DOCTOR_SPECIALTIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {formData.role === "Nurse" && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Assigned Ward
              </label>
              <div className="relative">
                <Building2
                  className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400 dark:text-slate-500"
                  size={18}
                />
                <select
                  name="ward"
                  value={formData.ward}
                  onChange={handleChange}
                  className={selectWithIconClass}
                >
                  <option value="" disabled>
                    Select a ward…
                  </option>
                  {NURSE_WARDS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-bold shadow-lg shadow-primary-600/20 transition-all hover:-translate-y-0.5"
            >
              Create User Account
            </button>
          </div>
        </form>
      </div>

      {/* --- TOAST NOTIFICATIONS --- */}
      <div className="fixed z-50 bottom-6 right-6">
        <AnimatePresence>
          {notification && (
            <Notification
              {...notification}
              onClose={() => setNotification(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserManagement;
