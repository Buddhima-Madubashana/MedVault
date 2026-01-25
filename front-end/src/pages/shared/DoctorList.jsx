import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext"; // Import Auth Context

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const { user } = useAuth(); // Get the current logged-in user

  useEffect(() => {
    fetch("http://localhost:5000/api/users/doctors")
      .then((res) => res.json())
      .then((data) => {
        // FILTER: Remove the current user from the list
        const filteredDoctors = data.filter((doc) => doc._id !== user._id);
        setDoctors(filteredDoctors);
      })
      .catch((err) => console.error("Error fetching doctors:", err));
  }, [user]);

  // Group doctors by specialty
  const groupedDoctors = doctors.reduce((acc, doctor) => {
    const specialty = doctor.specialty || "General";
    if (!acc[specialty]) acc[specialty] = [];
    acc[specialty].push(doctor);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
        Medical Staff: Doctors
      </h1>

      {doctors.length === 0 ? (
        <p className="text-zinc-500">No other doctors found.</p>
      ) : (
        Object.keys(groupedDoctors).map((specialty) => (
          <div key={specialty} className="space-y-4">
            <h2 className="pb-2 text-xl font-semibold text-blue-600 border-b border-zinc-200 dark:text-blue-400 dark:border-zinc-700">
              {specialty}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {groupedDoctors[specialty].map((doc) => (
                <div
                  key={doc._id}
                  className="flex flex-col items-center p-6 bg-white border shadow-sm rounded-xl hover:shadow-md dark:bg-zinc-800 dark:border-zinc-700"
                >
                  <div className="w-24 h-24 mb-4 overflow-hidden rounded-full ring-4 ring-blue-50 dark:ring-zinc-700">
                    <img
                      src={
                        doc.imageUrl ||
                        `https://ui-avatars.com/api/?name=${doc.name}&background=random`
                      }
                      alt={doc.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                    {doc.name}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {doc.email}
                  </p>
                  <span className="px-3 py-1 mt-2 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                    {specialty}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DoctorList;
