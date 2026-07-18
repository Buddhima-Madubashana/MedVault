import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Notification from "../../components/Notification";
import { Megaphone, Plus, Trash2, Edit2, AlertCircle, ToggleLeft, ToggleRight } from "lucide-react";

const AdminAnnouncements = () => {
  const { token, user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: "", message: "", priority: "normal", isActive: true });
  const [notification, setNotification] = useState(null);

  // Check if current user has admin rights (Admin or Temp Admin)
  const isAdmin = user?.role === "Admin" || (user?.isTempAdmin && new Date(user?.tempAdminExpiresAt) > new Date());

  useEffect(() => {
    fetchAnnouncements();
  }, [token]);

  const fetchAnnouncements = async () => {
    try {
      // Admins can see all announcements, others see only active ones.
      const url = isAdmin ? "http://localhost:5000/api/announcements/all" : "http://localhost:5000/api/announcements";
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (err) {
      console.error("Failed to fetch announcements", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `http://localhost:5000/api/announcements/${editingId}`
        : `http://localhost:5000/api/announcements`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setNotification({ type: "success", title: "Success", message: `Announcement ${editingId ? "updated" : "created"}.` });
        fetchAnnouncements();
        setIsModalOpen(false);
        resetForm();
      } else {
        const err = await res.json();
        setNotification({ type: "error", title: "Error", message: err.message || "Operation failed." });
      }
    } catch (err) {
      setNotification({ type: "error", title: "Error", message: "Server error." });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/announcements/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotification({ type: "success", title: "Deleted", message: "Announcement deleted." });
        fetchAnnouncements();
      }
    } catch (err) {
      setNotification({ type: "error", title: "Error", message: "Delete failed." });
    }
  };

  const handleToggleActive = async (announcement) => {
    try {
      const res = await fetch(`http://localhost:5000/api/announcements/${announcement._id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ isActive: !announcement.isActive })
      });
      if (res.ok) {
        fetchAnnouncements();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (announcement) => {
    setEditingId(announcement._id);
    setFormData({
      title: announcement.title,
      message: announcement.message,
      priority: announcement.priority,
      isActive: announcement.isActive
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: "", message: "", priority: "normal", isActive: true });
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400";
      case "low": return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400";
      default: return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400";
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        You do not have permission to manage announcements.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Megaphone className="text-blue-500" /> Announcements
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Manage system-wide notices and broadcasts.
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 font-bold text-white transition-all bg-blue-600 shadow-lg rounded-xl shadow-blue-500/30 hover:bg-blue-700 w-full md:w-auto justify-center"
        >
          <Plus size={18} /> New Notice
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {announcements.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white border border-slate-200 border-dashed rounded-2xl dark:bg-slate-800/50 dark:border-slate-700">
            No announcements found. Create one to broadcast to staff.
          </div>
        ) : (
          announcements.map((item) => (
            <div
              key={item._id}
              className={`relative flex flex-col p-6 transition-all duration-300 bg-white border shadow-sm dark:bg-slate-800 rounded-2xl group
                ${item.isActive ? 'border-slate-200 dark:border-slate-700' : 'border-slate-200 dark:border-slate-700 opacity-60'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2.5 py-1 text-xs font-bold uppercase rounded-md border ${getPriorityStyle(item.priority)}`}>
                  {item.priority}
                </span>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleToggleActive(item)} className="text-slate-400 hover:text-blue-500" title="Toggle Active">
                    {item.isActive ? <ToggleRight size={20} className="text-blue-500"/> : <ToggleLeft size={20}/>}
                  </button>
                  <button onClick={() => openEdit(item)} className="text-slate-400 hover:text-amber-500">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="text-slate-400 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold leading-tight text-slate-900 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 flex-grow whitespace-pre-wrap">
                {item.message}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <span className="text-xs font-medium text-slate-400">
                  By {item.author?.firstName || "Admin"}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
              {editingId ? "Edit Notice" : "Create Notice"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-semibold text-slate-700 dark:text-slate-300">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="E.g. System Maintenance"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold text-slate-700 dark:text-slate-300">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Enter details..."
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block mb-1 text-sm font-semibold text-slate-700 dark:text-slate-300">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Active</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all font-bold"
                >
                  Save Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncements;
