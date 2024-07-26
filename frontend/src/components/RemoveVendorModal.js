// src/components/RemoveVendorModal.js
import React from 'react';

const RemoveVendorModal = ({ vendors, onRemove, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Remove Vendor</h2>
        <ul className="space-y-2 mb-4 max-h-60 overflow-y-auto">
          {vendors.map(vendor => (
            <li key={vendor.id} className="flex justify-between items-center p-2 hover:bg-gray-100 rounded">
              <span>{vendor.name}</span>
              <button
                onClick={() => onRemove(vendor.id)}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition duration-300"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RemoveVendorModal;