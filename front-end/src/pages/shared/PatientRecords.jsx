import React, { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import Notification from "../../components/Notification";

// --- Mock Data (Fallback) ---
const initialPatients = [
  {
    id: 1,
    name: "John Doe",
    age: 45,
    disease: "Hypertension",
    ward: "Cardiology - Ward A",
    imageUrl: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 32,
    disease: "Severe Flu",
    ward: "General - Ward B",
    imageUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  {
    id: 3,
    name: "Robert Johnson",
    age: 58,
    disease: "Diabetes Type 2",
    ward: "Endocrinology - Ward C",
    imageUrl: "https://i.pravatar.cc/150?u=a04258114e29026302d",
  },
];

const PatientRecords = () => {
  // 1. Initialize state from LocalStorage if available
  const [patients, setPatients] = useState(() => {
    const savedPatients = localStorage.getItem("medvault_patients");
    return savedPatients ? JSON.parse(savedPatients) : initialPatients;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    disease: "",
    ward: "",
    imageUrl: "",
  });

  // Notification State
  const [notification, setNotification] = useState(null);

  // 2. Save to LocalStorage whenever 'patients' changes
  useEffect(() => {
    localStorage.setItem("medvault_patients", JSON.stringify(patients));
  }, [patients]);

  // Helper to show notifications
  const showNotification = (type, title, message) => {
    setNotification({ type, title, message, duration: 3000 });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Form Submit
  const handleAddPatient = (e) => {
    e.preventDefault();

    // Validation Check
    if (!newPatient.name || !newPatient.disease) {
      showNotification(
        "error",
        "Action Failed",
        "Please fill in all required fields (Name & Disease).",
      );
      return;
    }

    const patientToAdd = {
      id: Date.now(),
      ...newPatient,
      imageUrl:
        newPatient.imageUrl ||
        `https://ui-avatars.com/api/?name=${newPatient.name}&background=random`,
    };

    setPatients((prev) => [...prev, patientToAdd]);
    setIsModalOpen(false);
    setNewPatient({ name: "", age: "", disease: "", ward: "", imageUrl: "" });

    // Success Notification
    showNotification(
      "success",
      "Patient Added",
      `${patientToAdd.name} has been added to the records.`,
    );
  };

  // Handle Delete Patient
  const handleDeletePatient = (id) => {
    if (
      window.confirm("Are you sure you want to delete this patient record?")
    ) {
      setPatients((prev) => prev.filter((patient) => patient.id !== id));
      // Success Notification
      showNotification(
        "success",
        "Record Deleted",
        "The patient record has been successfully removed.",
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Patient Records
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage patient data and history.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 mt-4 text-white transition bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 md:mt-0 hover:shadow-lg"
        >
          + Add New Patient
        </button>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="relative flex flex-col items-center p-6 transition-transform bg-white border shadow-sm rounded-xl hover:shadow-md hover:-translate-y-1 dark:bg-zinc-800 dark:border-zinc-700 group"
          >
            {/* Delete Button */}
            <button
              onClick={() => handleDeletePatient(patient.id)}
              className="absolute p-2 transition-colors rounded-full top-3 right-3 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
              title="Delete Patient"
            >
              <Trash2 size={18} />
            </button>

            <div className="w-24 h-24 mb-4 overflow-hidden rounded-full ring-4 ring-blue-50 dark:ring-zinc-700">
              <img
                src={patient.imageUrl}
                alt={patient.name}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
              {patient.name}
            </h3>
            <span className="px-3 py-1 mb-4 text-sm font-medium text-blue-600 rounded-full bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400">
              {patient.ward}
            </span>

            <div className="w-full space-y-2 text-sm text-center">
              <div className="flex justify-between px-4 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-700/50">
                <span className="text-zinc-500 dark:text-zinc-400">Age</span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {patient.age}
                </span>
              </div>
              <div className="flex justify-between px-4 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-700/50">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Condition
                </span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {patient.disease}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Patient Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white shadow-2xl rounded-xl dark:bg-zinc-900 dark:border dark:border-zinc-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Add New Patient
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddPatient} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={newPatient.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Sarah Connor"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    required
                    value={newPatient.age}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 34"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Ward
                  </label>
                  <input
                    type="text"
                    name="ward"
                    required
                    value={newPatient.ward}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Ward A"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Disease / Condition
                </label>
                <input
                  type="text"
                  name="disease"
                  required
                  value={newPatient.disease}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Influenza"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Profile Image URL (Optional)
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={newPatient.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-4 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Save Patient
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      <div className="fixed z-50 bottom-4 right-4">
        <AnimatePresence>
          {notification && (
            <Notification
              key="notification-toast"
              type={notification.type}
              title={notification.title}
              message={notification.message}
              duration={notification.duration}
              onClose={() => setNotification(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PatientRecords;
