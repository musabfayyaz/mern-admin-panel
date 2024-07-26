// src/components/SidebarToggle.js
import React from 'react';
import { FiMenu } from 'react-icons/fi';

const SidebarToggle = ({ onClick }) => {
  return (
    <button onClick={onClick} className="lg:hidden bg-gray-800 text-white p-2 rounded focus:outline-none">
      <FiMenu size={24} />
    </button>
  );
};

export default SidebarToggle;
