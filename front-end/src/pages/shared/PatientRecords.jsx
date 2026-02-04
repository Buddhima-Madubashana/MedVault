import React, { useState, useEffect } from "react";
import { X, Trash2, Plus, Search, FileText } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Notification from "../../components/Notification";

const initialPatients = [
  {
    id: 1024,
    name: "John Doe",
    age: 45,
    disease: "Hypertension",
    ward: "Cardiology - A",
    status: "Stable",
    imageUrl: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  },
  {
    id: 1025,
    name: "Jane Smith",
    age: 32,
    disease: "Severe Flu",
    ward: "General - B",
    status: "Recovering",
    imageUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
];

const PatientRecords = () => {
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem("medvault_patients");
    return saved ? JSON.parse(saved) : initialPatients;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    disease: "",
    ward: "",
    imageUrl: "",
  });

  useEffect(() => {
    localStorage.setItem("medvault_patients", JSON.stringify(patients));
  }, [patients]);

  const showNotification = (type, title, message) =>
    setNotification({ type, title, message, duration: 3000 });

  const handleAddPatient = (e) => {
    e.preventDefault();
    if (!newPatient.name || !newPatient.disease) {
      showNotification("error", "Failed", "Name and Condition are required.");
      return;
    }
    const patientToAdd = {
      id: Math.floor(1000 + Math.random() * 9000),
      ...newPatient,
      status: "Stable",
      imageUrl:
        newPatient.imageUrl ||
        `https://ui-avatars.com/api/?name=${newPatient.name}&background=random`,
    };
    setPatients([...patients, patientToAdd]);
    setIsModalOpen(false);
    setNewPatient({ name: "", age: "", disease: "", ward: "", imageUrl: "" });
    showNotification("success", "Success", "Patient added to registry.");
  };

  const handleDelete = (id) => {
    if (confirm("Delete this patient record permanently?")) {
      setPatients(patients.filter((p) => p.id !== id));
      showNotification("success", "Deleted", "Record removed.");
    }
  };

  const getStatusColor = (status) => {
    if (status === "Critical") return "bg-red-100 text-red-700 border-red-200";
    if (status === "Recovering")
      return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-green-100 text-green-700 border-green-200";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Patient Registry
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Manage active patient records and assignments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Filter patients..."
              className="w-64 py-2 pl-10 pr-4 text-sm bg-white border outline-none rounded-xl border-slate-200 dark:bg-slate-800 dark:border-slate-700 focus:ring-2 ring-blue-500"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 font-medium text-white transition-all bg-blue-600 shadow-lg hover:bg-blue-700 rounded-xl shadow-blue-600/20"
          >
            <Plus size={18} /> Add Patient
          </button>
        </div>
      </div>

      {/* Grid with New Border Theme */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {patients.map((patient) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={patient.id}
            // THEME APPLIED HERE:
            className="relative p-6 transition-all duration-300 bg-white border border-blue-300 shadow-md group dark:bg-slate-800 rounded-2xl dark:border-blue-700 shadow-blue-100/50 dark:shadow-blue-900/20 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(patient.status)}`}
              >
                {patient.status || "Stable"}
              </span>
              <button
                onClick={() => handleDelete(patient.id)}
                className="text-slate-400 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 overflow-hidden shadow-inner rounded-2xl bg-slate-100">
                <img
                  src={patient.imageUrl}
                  alt={patient.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold leading-tight text-slate-900 dark:text-white">
                  {patient.name}
                </h3>
                <p className="mt-1 font-mono text-xs text-slate-400">
                  ID: #{patient.id}
                </p>
                <p className="text-sm font-medium text-blue-600">
                  {patient.ward}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 border bg-slate-50 dark:bg-slate-700/50 rounded-xl border-slate-100 dark:border-slate-600">
                <span className="block mb-1 text-xs font-bold uppercase text-slate-400">
                  Age
                </span>
                <span className="font-semibold text-slate-800 dark:text-white">
                  {patient.age} Yrs
                </span>
              </div>
              <div className="p-3 border bg-slate-50 dark:bg-slate-700/50 rounded-xl border-slate-100 dark:border-slate-600">
                <span className="block mb-1 text-xs font-bold uppercase text-slate-400">
                  Condition
                </span>
                <span className="font-semibold truncate text-slate-800 dark:text-white">
                  {patient.disease}
                </span>
              </div>
            </div>

            <button className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
              <FileText size={16} /> View Full Record
            </button>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg overflow-hidden bg-white border border-blue-300 shadow-2xl dark:bg-slate-900 rounded-3xl dark:border-slate-800"
            >
              <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Admit Patient
                  </h2>
                  <p className="text-sm text-slate-500">
                    Enter details for the new record.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 transition-colors bg-white border rounded-full dark:bg-slate-800 border-slate-200 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddPatient} className="p-8 space-y-5">
                {/* ... Form inputs ... */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={newPatient.name}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, name: e.target.value })
                    }
                    className="w-full px-4 py-3 transition-all border outline-none rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Sarah Connor"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="age"
                    value={newPatient.age}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, age: e.target.value })
                    }
                    className="w-full px-4 py-3 border rounded-xl border-slate-200 bg-slate-50"
                    placeholder="Age"
                    required
                  />
                  <input
                    name="ward"
                    value={newPatient.ward}
                    onChange={(e) =>
                      setNewPatient({ ...newPatient, ward: e.target.value })
                    }
                    className="w-full px-4 py-3 border rounded-xl border-slate-200 bg-slate-50"
                    placeholder="Ward"
                    required
                  />
                </div>
                <input
                  name="disease"
                  value={newPatient.disease}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, disease: e.target.value })
                  }
                  className="w-full px-4 py-3 border rounded-xl border-slate-200 bg-slate-50"
                  placeholder="Condition"
                  required
                />

                <button
                  type="submit"
                  className="w-full py-4 mt-4 font-bold text-white transition-all bg-blue-600 shadow-lg hover:bg-blue-700 rounded-xl shadow-blue-500/20"
                >
                  Create Record
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

export default PatientRecords;
