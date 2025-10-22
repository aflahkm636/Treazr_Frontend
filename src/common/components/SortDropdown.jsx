import React from "react";

const SortDropdown = ({ darkMode, onSortChange, categories }) => {
  const sortOptions = [
    { value: "all", label: "All Categories" },
    ...categories.map(cat => ({
      value: cat.id.toString(),
      label: cat.name
    }))
  ];

  return (
    <select
      onChange={(e) => onSortChange(e.target.value)}
      className={`block w-full sm:w-64 pl-3 pr-10 py-2 border rounded-md leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${
        darkMode
          ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
          : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
      }`}
    >
      {sortOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SortDropdown;