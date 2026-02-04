import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const NurseList = () => {
  const [nurses, setNurses] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetch("http://localhost:5000/api/users/nurses")
      .then((res) => res.json())
      .then((data) => {
        const filteredNurses = data.filter((nurse) => nurse._id !== user._id);
        setNurses(filteredNurses);
      })
      .catch((err) => console.error("Error fetching nurses:", err));
  }, [user]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        Nursing Staff
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {nurses.map((nurse) => (
          <div
            key={nurse._id}
            // THEME APPLIED HERE:
            className="flex flex-col items-center p-6 transition-all bg-white border border-blue-300 shadow-md dark:bg-slate-800 rounded-2xl dark:border-blue-700 shadow-blue-100/50 dark:shadow-blue-900/20 hover:shadow-xl"
          >
            <div className="w-24 h-24 mb-4 overflow-hidden rounded-full ring-4 ring-pink-50 dark:ring-slate-700">
              <img
                src={
                  nurse.imageUrl ||
                  `https://ui-avatars.com/api/?name=${nurse.name}&background=random`
                }
                alt={nurse.name}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {nurse.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {nurse.email}
            </p>
            <span className="px-3 py-1 mt-3 text-xs font-bold text-pink-700 bg-pink-100 border border-pink-200 rounded-full">
              {nurse.ward || "General Ward"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NurseList;
