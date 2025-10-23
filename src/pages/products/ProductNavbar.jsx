import { useSearch } from "./Products";
import { FaSearch, FaTimes } from "react-icons/fa";

const ProductNavbar = () => {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm mt-15 sm:mt-15">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="relative">
          {/* Search Icon */}
          <FaSearch className="absolute left-4 top-3.5 text-gray-400" />

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search our collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-sm sm:text-base rounded-full border border-gray-300 
                       bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 
                       focus:border-indigo-400 placeholder-gray-400 transition-all duration-200"
          />

          {/* Clear Button */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition"
            >
              <FaTimes size={14} />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default ProductNavbar;
