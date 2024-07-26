// src/components/Sidebar.js
import React from 'react';

const Sidebar = ({ vendors, selectedVendor, onVendorClick, onAddVendor, onRemoveVendor, sidebarOpen, onClose }) => {
  return (
    <aside className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-20`}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl md:hidden"
        aria-label="Close sidebar"
      >
        &times;
      </button>
      <h2 className="text-xl font-bold p-4 border-b border-gray-700">Vendors</h2>
      <ul className="py-4 overflow-y-auto" style={{maxHeight: 'calc(100vh - 200px)'}}>
        {vendors.map(vendor => (
          <li
            key={vendor._id}
            className={`cursor-pointer p-3 ${selectedVendor?._id === vendor.id ? 'bg-gray-700' : 'hover:bg-gray-700'} transition duration-300`}
            onClick={() => onVendorClick(vendor)}
          >
            {vendor.name}
          </li>
        ))}
      </ul>
      <div className="absolute bottom-4 left-4 right-4 space-y-2">
        <button
          onClick={onAddVendor}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition duration-300"
        >
          Add Vendor
        </button>
        <button
          onClick={onRemoveVendor}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition duration-300"
        >
          Remove Vendor
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;