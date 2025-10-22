// StatsCard.jsx
import React from "react";

const StatsCard = ({ title, value, icon, darkMode, color }) => {
  return (
    <div className={`p-6 rounded-xl shadow-sm ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold mt-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
            {value}
          </p>
        </div>
        <div className="text-3xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;