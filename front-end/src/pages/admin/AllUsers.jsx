import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Search,
  User,
  Stethoscope,
  Activity,
  Users,
  Eye,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Notification from "../../components/Notification";
import { useAuth } from "../../contexts/AuthContext";

const AllUsers = () => {
  const { user, token } = useAuth(); // Admin user
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Doctors"); // 'Doctors' | 'Nurses' | 'Patients'
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(null);

  // Confirm Dialog State
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  // --- FETCH DATA BASED ON TAB ---
  const fetchData = () => {
    let url = "";
    if (activeTab === "Doctors")
      url = "http://localhost:5000/api/users/doctors";
    else if (activeTab === "Nurses")
      url = "http://localhost:5000/api/users/nurses";
    else if (activeTab === "Patients")
      url = "http://localhost:5000/api/patients";

    const options = {};
    if (activeTab === "Patients") {
      if (!token) return;
      options.headers = { Authorization: `Bearer ${token}` };
    }

    fetch(url, options)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (activeTab === "Patients" && !token) return;
    fetchData();
    setSearchTerm(""); // Reset search on tab switch
  }, [activeTab, token]);

  // --- DELETE HANDLER ---
  const initiateDelete = (item) => {
    setConfirmDialog({
      isOpen: true,
      title: `Delete ${activeTab === "Patients" ? "Patient" : "User"}?`,
      message: `Are you sure you want to permanently delete ${item.name}? This action cannot be undone.`,
      onConfirm: () => handleDelete(item._id),
    });
  };

  const handleDelete = async (id) => {
    try {
      // Determine Endpoint based on Tab
      let endpoint = "";
      if (activeTab === "Patients") {
        endpoint = `http://localhost:5000/api/patients/${id}?actionBy=${user._id}`;
      } else {
        endpoint = `http://localhost:5000/api/users/${id}?actionBy=${user._id}`;
      }

      const res = await fetch(endpoint, { method: "DELETE" });

      if (res.ok) {
        setNotification({
          type: "success",
          title: "Deleted",
          message: "Record removed successfully.",
        });
        setData(data.filter((item) => item._id !== id));
      } else {
        const err = await res.json();
        setNotification({
          type: "error",
          title: "Error",
          message: err.message || "Failed to delete.",
        });
      }
    } catch (err) {
      setNotification({
        type: "error",
        title: "Error",
        message: "Server error.",
      });
    }
  };

  // --- FILTERING ---
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.email &&
        item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.ward && item.ward.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  // --- HELPER FOR TABS ---
  const TabButton = ({ name, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(name)}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
        activeTab === name
          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
          : "bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"
      }`}
    >
      <Icon size={18} /> {name}
    </button>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          System Users
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          View and manage all registered accounts and patient records.
        </p>
      </div>

      {/* Controls: Tabs & Search */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex w-full gap-3 pb-2 overflow-x-auto md:pb-0 md:w-auto">
          <TabButton name="Doctors" icon={Stethoscope} />
          <TabButton name="Nurses" icon={Activity} />
          <TabButton name="Patients" icon={Users} />
        </div>

        <div className="relative w-full md:w-64">
          <Search
            className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 pl-10 pr-4 transition-all bg-white border shadow-sm outline-none rounded-xl border-slate-200 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div
              key={item._id}
              className="relative p-6 transition-all duration-300 bg-white border border-blue-300 shadow-sm dark:bg-slate-800 rounded-2xl dark:border-blue-700 shadow-blue-200/50 dark:shadow-blue-900/20 hover:shadow-xl hover:-translate-y-1 group"
            >
              {/* Delete Button (Top Right) */}
              <button
                onClick={() => initiateDelete(item)}
                className="absolute p-2 transition-colors rounded-lg top-4 right-4 text-slate-300 hover:text-red-500 hover:bg-red-50"
              >
                <Trash2 size={18} />
              </button>

              <div className="flex items-center gap-4 mb-4">
                <img
                  src={
                    item.imageUrl ||
                    `https://ui-avatars.com/api/?name=${item.name}&background=random`
                  }
                  alt={item.name}
                  className={`w-16 h-16 rounded-2xl object-cover border-2 ${activeTab === "Patients" ? "border-green-100" : "border-blue-100"}`}
                />
                <div>
                  <h3 className="text-lg font-bold leading-tight text-slate-900 dark:text-white">
                    {item.name}
                  </h3>
                  <p className="text-sm font-medium text-blue-600">
                    {activeTab === "Doctors" && item.specialty}
                    {activeTab === "Nurses" && (item.ward || "General Ward")}
                    {activeTab === "Patients" && (item.ward || "Unassigned")}
                  </p>
                </div>
              </div>

              {/* Details Section */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                {activeTab === "Patients" ? (
                  <>
                    <div>
                      <span className="block mb-1 text-xs font-bold uppercase text-slate-400">
                        Age
                      </span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {item.age} Years
                      </span>
                    </div>
                    <div>
                      <span className="block mb-1 text-xs font-bold uppercase text-slate-400">
                        Condition
                      </span>
                      <span className="font-medium truncate text-slate-700 dark:text-slate-300">
                        {item.disease}
                      </span>
                    </div>
                    {/* View Private Details Button */}
                    <div className="col-span-2 pt-2">
                      <button
                        onClick={() => navigate(`/admin/patients/${item._id}`)}
                        className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-bold text-blue-600 transition-colors bg-blue-50 hover:bg-blue-100 rounded-xl dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                      >
                        <Eye size={16} /> View Encrypted Details
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-span-2">
                      <span className="block mb-1 text-xs font-bold uppercase text-slate-400">
                        Email
                      </span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {item.email}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center bg-white border border-dashed col-span-full text-slate-500 dark:bg-slate-800 rounded-2xl border-slate-300 dark:border-slate-700">
            <User size={48} className="mx-auto mb-3 text-slate-300" />
            <p className="text-lg font-medium">No {activeTab} found</p>
            <p className="text-sm">Try adjusting your search terms.</p>
          </div>
        )}
      </div>

      {/* --- CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {confirmDialog.isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/20 backdrop-blur-[2px] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-sm p-6 bg-white border shadow-2xl dark:bg-slate-800 rounded-2xl border-slate-200 dark:border-slate-700"
            >
              <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                {confirmDialog.title}
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {confirmDialog.message}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() =>
                    setConfirmDialog({ ...confirmDialog, isOpen: false })
                  }
                  className="px-4 py-2 text-sm font-medium transition-colors rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (confirmDialog.onConfirm) confirmDialog.onConfirm();
                    setConfirmDialog({ ...confirmDialog, isOpen: false });
                  }}
                  className="px-4 py-2 text-sm font-bold text-white transition-all bg-red-600 rounded-lg shadow-md hover:bg-red-700 shadow-red-500/20"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- TOAST --- */}
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

export default AllUsers;
