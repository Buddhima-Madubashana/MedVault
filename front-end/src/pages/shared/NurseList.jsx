import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext"; // Import Auth Context

const NurseList = () => {
  const [nurses, setNurses] = useState([]);
  const { user } = useAuth(); // Get current user

  useEffect(() => {
    fetch("http://localhost:5000/api/users/nurses")
      .then((res) => res.json())
      .then((data) => {
        // FILTER: Remove the current user from the list
        const filteredNurses = data.filter((nurse) => nurse._id !== user._id);
        setNurses(filteredNurses);
      })
      .catch((err) => console.error("Error fetching nurses:", err));
  }, [user]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
        Nursing Staff
      </h1>

      {nurses.length === 0 ? (
        <p className="text-zinc-500">No other nurses found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {nurses.map((nurse) => (
            <div
              key={nurse._id}
              className="flex flex-col items-center p-6 bg-white border shadow-sm rounded-xl hover:shadow-md dark:bg-zinc-800 dark:border-zinc-700"
            >
              <div className="w-24 h-24 mb-4 overflow-hidden rounded-full ring-4 ring-pink-50 dark:ring-zinc-700">
                <img
                  src={
                    nurse.imageUrl ||
                    `https://ui-avatars.com/api/?name=${nurse.name}&background=random`
                  }
                  alt={nurse.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                {nurse.name}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {nurse.email}
              </p>
              <span className="px-3 py-1 mt-2 text-xs font-medium text-pink-700 bg-pink-100 rounded-full">
                {nurse.ward || "General Ward"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NurseList;
