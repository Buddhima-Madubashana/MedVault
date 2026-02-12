import React, { useState, useEffect } from "react";
import {
  Trash2,
  Plus,
  FileText,
  UserCheck,
  X,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Notification from "../../components/Notification";
import { useAuth } from "../../contexts/AuthContext";

const PatientRecords = () => {
  const { user, role } = useAuth();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  // --- MODALS STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false); // Add Patient
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Manual Doctor Select

  // --- CONFIRMATION DIALOG STATE (New) ---
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  // --- DATA STATE ---
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [deleteDoctorId, setDeleteDoctorId] = useState("");
  const [notification, setNotification] = useState(null);

  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    disease: "",
    ward: "",
    imageUrl: "",
    doctorId: "",
    email: "",
    phone: "",
    address: "",
    guardianName: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPatient({ ...newPatient, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // --- 1. FETCH DATA ---
  const fetchData = () => {
    fetch("http://localhost:5000/api/patients")
      .then((res) => res.json())
      .then((data) => setPatients(data))
      .catch((err) => console.error(err));

    if (role === "Nurse") {
      fetch("http://localhost:5000/api/users/doctors")
        .then((res) => res.json())
        .then((data) => setDoctors(data))
        .catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, role]);

  const showNotification = (type, title, msg) =>
    setNotification({ type, title, message: msg, duration: 3000 });

  // --- 2. HANDLE ADD SUBMIT ---
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const patientData = {
      ...newPatient,
      imageUrl:
        newPatient.imageUrl ||
        `https://ui-avatars.com/api/?name=${newPatient.name}&background=random`,
    };

    try {
      if (role === "Doctor" || role === "Admin") {
        // Direct Add: Pass 'actionBy'
        const res = await fetch("http://localhost:5000/api/patients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...patientData, actionBy: user._id }), // <--- UPDATED
        });
        if (res.ok)
          showNotification("success", "Added", "Patient added successfully.");
      } else {
        // ... Nurse logic remains same (User ID is already passed as nurseId) ...
        if (!newPatient.doctorId) {
          /*...*/ return;
        }
        const res = await fetch("http://localhost:5000/api/patient-requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...patientData,
            nurseId: user._id,
            doctorId: newPatient.doctorId,
            status: "Pending",
            requestType: "Add",
          }),
        });
        if (res.ok)
          showNotification("info", "Sent", "Admission request sent to doctor.");
      }
      fetchData();
      setIsModalOpen(false);
      setNewPatient({
        name: "",
        age: "",
        disease: "",
        ward: "",
        imageUrl: "",
        doctorId: "",
      });
    } catch (err) {
      showNotification("error", "Error", "Operation failed.");
    }
  };

  // --- 3. HANDLE DELETE ---
  const initiateDelete = (patient) => {
    if (role === "Doctor" || role === "Admin") {
      // Direct Delete: Pass 'actionBy' in query
      setConfirmDialog({
        isOpen: true,
        title: "Delete Record?",
        message: `Are you sure you want to permanently delete the record for ${patient.name}?`,
        onConfirm: () => {
          // <--- UPDATED URL below
          fetch(
            `http://localhost:5000/api/patients/${patient._id}?actionBy=${user._id}`,
            { method: "DELETE" },
          ).then(() => {
            showNotification("success", "Deleted", "Record removed.");
            fetchData();
          });
        },
      });
    } else {
      // --- NURSE LOGIC ---
      const approvingDoctor = doctors.find(
        (doc) => doc._id === patient.approvedBy,
      );

      if (approvingDoctor) {
        // Automatic Path: We know the doctor, Show Confirmation Dialog
        setConfirmDialog({
          isOpen: true,
          title: "Request Discharge",
          message: `Request discharge approval from Dr. ${approvingDoctor.name}?`,
          onConfirm: () =>
            sendDeleteRequest(
              patient,
              patient.approvedBy,
              approvingDoctor.name,
            ),
        });
      } else {
        // Manual Path: Doctor unknown, open selection modal
        setPatientToDelete(patient);
        setIsDeleteModalOpen(true);
      }
    }
  };

  const sendDeleteRequest = async (patient, docId, docName = "") => {
    try {
      await fetch("http://localhost:5000/api/patient-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType: "Delete",
          patientId: patient._id,
          name: patient.name,
          nurseId: user._id,
          doctorId: docId,
          status: "Pending",
        }),
      });

      const finalDocName =
        docName || doctors.find((d) => d._id === docId)?.name || "the doctor";
      showNotification(
        "info",
        "Request Sent",
        `Discharge request sent to Dr. ${finalDocName}.`,
      );

      setIsDeleteModalOpen(false);
      setDeleteDoctorId("");
      setPatientToDelete(null);
    } catch (err) {
      showNotification("error", "Failed", "Could not send request.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Patient Registry
          </h1>
          <p className="mt-1 text-slate-500">Manage active patient records.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2 font-bold text-white transition-all bg-blue-600 shadow-lg rounded-xl hover:bg-blue-700"
        >
          <Plus size={18} />{" "}
          {role === "Nurse" ? "Request Admission" : "Add Patient"}
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {patients.map((patient) => (
          <div
            key={patient._id}
            className="relative p-6 transition-all bg-white border border-blue-300 shadow-sm dark:bg-slate-800 rounded-2xl dark:border-blue-700 group hover:shadow-md"
          >
            <div className="flex justify-between mb-4">
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                Stable
              </span>
              <button
                onClick={() => initiateDelete(patient)}
                className="text-slate-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={patient.imageUrl}
                className="object-cover w-16 h-16 border rounded-2xl bg-slate-100 border-slate-200"
                alt=""
              />
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {patient.name}
                </h3>
                <p className="text-sm font-medium text-blue-600">
                  {patient.ward}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <span className="text-xs font-bold uppercase text-slate-400">
                  Age
                </span>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {patient.age}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <span className="text-xs font-bold uppercase text-slate-400">
                  Condition
                </span>
                <div className="font-semibold truncate text-slate-900 dark:text-white">
                  {patient.disease}
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate(`${patient._id}`)} // Use navigate relative path or absolute `/role/patients/${patient._id}`
              className="w-full py-2.5 rounded-xl border border-blue-200 text-blue-600 font-medium text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              <FileText size={16} /> View Full Record
            </button>
          </div>
        ))}
      </div>

      {/* --- CONFIRMATION DIALOG (New Custom Popup) --- */}
      <AnimatePresence>
        {confirmDialog.isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/20 backdrop-blur-[2px] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-sm p-6 bg-white border shadow-2xl dark:bg-slate-800 rounded-2xl border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 rounded-full bg-blue-50 dark:bg-blue-900/20">
                  <AlertCircle
                    className="text-blue-600 dark:text-blue-400"
                    size={24}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-lg font-bold text-slate-900 dark:text-white">
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
                      className="px-4 py-2 text-sm font-bold text-white transition-all bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 shadow-blue-500/20"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- ADD PATIENT MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl overflow-hidden bg-white border shadow-2xl dark:bg-slate-900 rounded-3xl border-slate-200 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-slate-50 dark:bg-slate-800/50 dark:border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {role === "Nurse" ? "Request Admission" : "Admit Patient"}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {role === "Nurse"
                      ? "Details will be sent for approval."
                      : "Enter details for the new record."}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 transition-colors rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="flex-1 p-8 overflow-y-auto">
                <form id="add-patient-form" onSubmit={handleAddSubmit}>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
                    
                    {/* LEFT COLUMN: Photo (span 3) */}
                    <div className="md:col-span-3 flex flex-col items-center space-y-4">
                      <div className="relative w-32 h-32 overflow-hidden rounded-full bg-slate-100 border-4 border-slate-50 shadow-sm dark:bg-slate-800 dark:border-slate-700">
                        {newPatient.imageUrl ? (
                          <img
                            src={newPatient.imageUrl}
                            alt="Preview"
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <UserCheck className="w-12 h-12 m-auto text-slate-300 mt-9" />
                        )}
                      </div>
                      <label className="cursor-pointer px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30">
                        Upload Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* RIGHT COLUMN: Inputs (span 9) */}
                    <div className="md:col-span-9 space-y-6">
                      
                      {/* Section 1: Core Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2 space-y-1.5">
                          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            name="name"
                            value={newPatient.name}
                            onChange={(e) =>
                              setNewPatient({ ...newPatient, name: e.target.value })
                            }
                            className="w-full px-4 py-2.5 border outline-none rounded-xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                            placeholder="e.g. Sarah Connor"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            Age <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="age"
                            value={newPatient.age}
                            onChange={(e) =>
                              setNewPatient({ ...newPatient, age: e.target.value })
                            }
                            className="w-full px-4 py-2.5 border outline-none rounded-xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                            placeholder="34"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            Guardian Name
                          </label>
                          <input
                            name="guardianName"
                            value={newPatient.guardianName}
                            onChange={(e) =>
                              setNewPatient({ ...newPatient, guardianName: e.target.value })
                            }
                            className="w-full px-4 py-2.5 border outline-none rounded-xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                            placeholder="Guardian Name"
                          />
                        </div>
                      </div>

                      {/* Section 2: Contact Info */}
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-800/50 dark:border-slate-700 space-y-4">
                        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Contact Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                              Email
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={newPatient.email}
                              onChange={(e) =>
                                setNewPatient({ ...newPatient, email: e.target.value })
                              }
                              className="w-full px-4 py-2.5 border outline-none rounded-xl border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                              placeholder="email@example.com"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={newPatient.phone}
                              onChange={(e) =>
                                setNewPatient({ ...newPatient, phone: e.target.value })
                              }
                              className="w-full px-4 py-2.5 border outline-none rounded-xl border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                              placeholder="+1 234 567 8900"
                            />
                          </div>

                          <div className="md:col-span-2 space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                              Address
                            </label>
                            <input
                              name="address"
                              value={newPatient.address}
                              onChange={(e) =>
                                setNewPatient({ ...newPatient, address: e.target.value })
                              }
                              className="w-full px-4 py-2.5 border outline-none rounded-xl border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                              placeholder="123 Street Name, City"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Medical Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                         <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                              Ward <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="ward"
                              value={newPatient.ward}
                              onChange={(e) =>
                                setNewPatient({ ...newPatient, ward: e.target.value })
                              }
                              className="w-full px-4 py-2.5 border outline-none rounded-xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                              required
                            >
                              <option value="">Select Ward</option>
                              <option value="General Ward">General Ward</option>
                              <option value="Emergency (ER)">Emergency (ER)</option>
                              <option value="ICU">Intensive Care Unit (ICU)</option>
                              <option value="Pediatrics">Pediatrics</option>
                              <option value="Maternity">Maternity</option>
                              <option value="Surgical">Surgical</option>
                              <option value="Orthopedic">Orthopedic</option>
                              <option value="Cardiology">Cardiology</option>
                              <option value="Neurology">Neurology</option>
                              <option value="Oncology">Oncology</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                              Condition <span className="text-red-500">*</span>
                            </label>
                            <input
                              name="disease"
                              value={newPatient.disease}
                              onChange={(e) =>
                                setNewPatient({
                                  ...newPatient,
                                  disease: e.target.value,
                                })
                              }
                              className="w-full px-4 py-2.5 border outline-none rounded-xl border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                              placeholder="Acute Bronchitis"
                              required
                            />
                          </div>

                          {role === "Nurse" && (
                            <div className="md:col-span-2 space-y-1.5">
                              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                                <UserCheck size={16} className="text-blue-500" /> Select
                                Approving Doctor <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <select
                                  name="doctorId"
                                  value={newPatient.doctorId}
                                  onChange={(e) =>
                                    setNewPatient({
                                      ...newPatient,
                                      doctorId: e.target.value,
                                    })
                                  }
                                  className="w-full px-4 py-2.5 border border-blue-300 outline-none appearance-none cursor-pointer rounded-xl bg-blue-50/50 hover:bg-blue-50 dark:bg-slate-800 dark:border-blue-900 dark:text-white"
                                  required
                                >
                                  <option value="">-- Choose a Doctor --</option>
                                  {doctors.map((doc) => (
                                    <option key={doc._id} value={doc._id}>
                                      Dr. {doc.name} ({doc.specialty})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          )}
                      </div>

                    </div>
                  </div>
                </form>
              </div>

               {/* Footer */}
               <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-4 dark:bg-slate-800/50 dark:border-slate-800">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="add-patient-form"
                    className="px-6 py-2.5 text-sm font-bold text-white transition-all bg-blue-600 shadow-lg hover:bg-blue-700 rounded-xl shadow-blue-500/20"
                  >
                    {role === "Nurse" ? "Send Admission Request" : "Create Patient Record"}
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MANUAL DELETE DOCTOR SELECTION MODAL --- */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md p-8 bg-white border border-red-200 shadow-2xl rounded-3xl"
            >
              <h2 className="mb-2 text-xl font-bold text-slate-900">
                Request Discharge
              </h2>
              <p className="mb-6 text-sm text-slate-500">
                Select a doctor to approve the removal of{" "}
                <strong>{patientToDelete?.name}</strong>.
              </p>
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700">
                  Approving Doctor
                </label>
                <select
                  className="w-full px-4 py-3 border outline-none rounded-xl border-slate-300 bg-slate-50"
                  value={deleteDoctorId}
                  onChange={(e) => setDeleteDoctorId(e.target.value)}
                >
                  <option value="">-- Select Doctor --</option>
                  {doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      Dr. {doc.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() =>
                    sendDeleteRequest(patientToDelete, deleteDoctorId)
                  }
                  disabled={!deleteDoctorId}
                  className="w-full py-3 font-bold text-white transition-all bg-red-600 hover:bg-red-700 rounded-xl disabled:opacity-50"
                >
                  Send Discharge Request
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full py-2 text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notification Toast */}
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
