import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetch("http://localhost:5000/api/users/doctors")
      .then((res) => res.json())
      .then((data) => {
        const filteredDoctors = data.filter((doc) => doc._id !== user._id);
        setDoctors(filteredDoctors);
      })
      .catch((err) => console.error("Error fetching doctors:", err));
  }, [user]);

  const groupedDoctors = doctors.reduce((acc, doctor) => {
    const specialty = doctor.specialty || "General";
    if (!acc[specialty]) acc[specialty] = [];
    acc[specialty].push(doctor);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        Medical Staff: Doctors
      </h1>

      {Object.keys(groupedDoctors).map((specialty) => (
        <div key={specialty} className="space-y-4">
          <h2 className="inline-block pb-2 text-xl font-bold text-blue-600 border-b border-blue-200 dark:text-blue-400 dark:border-blue-800">
            {specialty}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {groupedDoctors[specialty].map((doc) => (
              <div
                key={doc._id}
                // THEME APPLIED HERE:
                className="flex flex-col items-center p-6 transition-all bg-white border border-blue-300 shadow-md dark:bg-slate-800 rounded-2xl dark:border-blue-700 shadow-blue-100/50 dark:shadow-blue-900/20 hover:shadow-xl"
              >
                <div className="w-24 h-24 mb-4 overflow-hidden rounded-full ring-4 ring-blue-50 dark:ring-slate-700">
                  <img
                    src={
                      doc.imageUrl ||
                      `https://ui-avatars.com/api/?name=${doc.name}&background=random`
                    }
                    alt={doc.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {doc.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {doc.email}
                </p>
                <span className="px-3 py-1 mt-3 text-xs font-bold text-blue-700 bg-blue-100 border border-blue-200 rounded-full">
                  {specialty}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DoctorList;
