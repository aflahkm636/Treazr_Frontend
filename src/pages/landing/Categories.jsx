import React from "react";
import { Link } from "react-router-dom";

function Categories() {
  const categories = [
    {
      name: "Action figures",
      image:
        "https://i.pinimg.com/1200x/d6/ae/93/d6ae9327c89b54a469eb58c67884bad4.jpg",
      count: "2,450+",
    },
    {
      name: "Diecast cars",
      image:
        "https://i.pinimg.com/1200x/0d/46/61/0d46615f14419a3223b56a5d5beb7638.jpg",
      count: "1,890+",
    },
    {
      name: "Comic Books",
      image:
        "https://i.pinimg.com/736x/cd/0f/90/cd0f90b9aa12a294679e311c405023e1.jpg",
      count: "3,120+",
    },
    {
      name: "Cards",
      image:
        "https://i.pinimg.com/1200x/29/4a/b2/294ab27746705b329ebcd1275cb90df3.jpg",
      count: "5,640+",
    },
  ];

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-8 lg:px-16 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 sm:mb-4">
            Explore by{" "}
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
              Category
            </span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-lg">
            Handpicked collections for every collector
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {categories.map((cat) => (
            <Link
              to={`/category/${encodeURIComponent(cat.name)}`}
              key={cat.name}
              className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 cursor-pointer h-64 sm:h-72"
            >
              {/* Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-500 group-hover:opacity-90" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 z-10">
                <div className="text-3xl sm:text-4xl transition-transform duration-500 group-hover:scale-110">
                  {cat.icon}
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-1 sm:mb-2 transition-all duration-300 group-hover:translate-y-0 translate-y-1">
                    {cat.name}
                  </h3>
                  <p className="text-cyan-300 text-xs sm:text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {cat.count} items
                  </p>
                  <div className="mt-2 sm:mt-3 h-1 w-10 sm:w-12 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                </div>
              </div>

              {/* Border Glow */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-400/30 rounded-2xl transition-all duration-500 pointer-events-none" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Categories;
