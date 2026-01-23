"use client";
import NavigationBar from "../components/Navigation";
import React from "react";
const styles = `
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in-up {
    animation: fade-in-up 0.6s ease-out forwards;
    opacity: 0;
  }
`;
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
const teamMembers = [
  {
    name: "Zane Whitaker",
    role: "Founder & CEO",
    imageUrl: "https://i.postimg.cc/W1rCvYnT/nazmul-hossain.jpg",
  },
  {
    name: "Emily Jonson",
    role: "CEO",
    imageUrl:
      "https://i.pinimg.com/736x/8c/6d/db/8c6ddb5fe6600fcc4b183cb2ee228eb7.jpg",
  },
  {
    name: "Harshita Patel",
    role: "HR",
    imageUrl:
      "https://i.pinimg.com/736x/6f/a3/6a/6fa36aa2c367da06b2a4c8ae1cf9ee02.jpg",
  },
  {
    name: "Eleanor Morales",
    role: "HR",
    imageUrl:
      "https://i.pinimg.com/1200x/c2/4e/27/c24e271f2f992fd7e62e8c1e8d9b3e2f.jpg",
  },
  {
    name: "Sophia Monic",
    role: "Product Manager",
    imageUrl:
      "https://i.pinimg.com/736x/81/d6/b1/81d6b158728f5fc97ca6e0a025fefee0.jpg",
  },
  {
    name: "James Miller",
    role: "Marketing Lead",
    imageUrl:
      "https://i.pinimg.com/736x/9f/46/74/9f4674ca9c17330ab419c1b2f5951d9a.jpg",
  },
  {
    name: "Olivia Chen",
    role: "Lead Developer",
    imageUrl:
      "https://i.pinimg.com/736x/57/3c/80/573c80967c9429d0ed0ce32701f85b70.jpg",
  },
  {
    name: "Benjamin Carter",
    role: "UX Designer",
    imageUrl:
      "https://i.pinimg.com/736x/b0/c4/21/b0c421e77cf563962026ade82c90dd5b.jpg",
  },
  {
    name: "Ava Rodriguez",
    role: "Data Scientist",
    imageUrl:
      "https://i.pinimg.com/736x/ce/31/42/ce3142d7a968fff3aecd0100572a5e8b.jpg",
  },
  {
    name: "Lucas Garcia",
    role: "Backend Engineer",
    imageUrl:
      "https://i.pinimg.com/736x/79/63/a5/7963a5246188d408b8f28961a0cf2b90.jpg",
  },
  {
    name: "Mia Martinez",
    role: "Frontend Developer",
    imageUrl:
      "https://i.pinimg.com/736x/8e/c1/f8/8ec1f80db272047cedf4c20263114387.jpg",
  },
  {
    name: "Henry Wilson",
    role: "DevOps Engineer",
    imageUrl:
      "https://i.pinimg.com/1200x/08/a2/41/08a2413b771b729a9f9df20fa97be52a.jpg",
  },
];
const TeamMemberCard = ({ member }) => {
  return (
    <div className="flex flex-col items-center p-6 text-center transition-all duration-300 bg-white border border-gray-100 shadow-sm group dark:bg-gray-900 rounded-2xl hover:shadow-xl dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:-translate-y-1">
      <div className="relative w-32 h-32 mb-4 md:w-40 md:h-40">
        <div className="absolute inset-0 transition-opacity duration-300 rounded-full opacity-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 group-hover:opacity-20"></div>
        <img
          className="relative object-cover w-full h-full transition-all duration-300 rounded-full ring-4 ring-white dark:ring-gray-800 group-hover:ring-gray-100 dark:group-hover:ring-gray-700"
          src={member.imageUrl}
          alt={`Portrait of ${member.name}`}
          onError={(e) => {
            const target = e.target;
            target.onerror = null;
            target.src = `https://placehold.co/200x200/E2E8F0/4A5568?text=${member.name
              .split(" ")
              .map((n) => n[0])
              .join("")}`;
          }}
        />
      </div>
      <h3 className="mb-1 text-xl font-bold text-gray-900 transition-colors duration-300 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
        {member.name}
      </h3>
      <p className="px-3 py-1 mb-4 text-sm font-medium text-gray-600 rounded-full dark:text-gray-300 bg-gray-50 dark:bg-gray-800">
        {member.role}
      </p>
    </div>
  );
};
const Nurse = () => {
  return (
    <div>
      <NavigationBar></NavigationBar>
      <section className="relative overflow-hidden font-sans transition-colors bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-black dark:via-gray-900 dark:to-black">
        {}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[size:20px_20px]"></div>

        <div className="relative w-full px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4">
            {teamMembers.map((member, index) => (
              <div
                key={member.name}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <TeamMemberCard member={member} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
export default Nurse;
