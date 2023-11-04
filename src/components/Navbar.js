import React, { useState } from "react";
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white p-4 shadow-lg">
      <div className="mx-auto flex items-center justify-between">
        <Link to="/" className="text-gray-900 text-2xl font-semibold">
          Emlak Sitesi
        </Link>
        <div className="md:hidden">
          <button
            onClick={toggleNavbar}
            className="text-gray-900 hover:text-gray-600 focus:outline-none"
          >
          </button>
        </div>
        <ul className={`md:flex md:items-center space-x-4 ${isOpen ? "block" : "hidden"}`}>
          <li>
            <Link to="/" className="text-gray-900 hover:text-blue-500">
              Ana Sayfa
            </Link>
          </li>
          <li>
            <Link to="/ilan-ekle" className="text-gray-900 hover:text-blue-500">
              İlan Ekle
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
