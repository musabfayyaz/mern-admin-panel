import React, { useState } from "react";
import adminAPI from "../services/api";

const MainContent = ({
  loggedInUser,
  selectedVendor,
  showAddVendorForm,
  showAssignClientForm,
  onAddVendor,
  setVendors,
  onCancelAddVendor,
  onToggleAssignClientForm,
  setShowAssignClientForm,
  vendors,
  fetchVendors,
}) => {
  const [newVendor, setNewVendor] = useState({
    name: "",
    username: "",
    password: "",
    phone: "",
    address: "",
  });
  const [newClient, setNewClient] = useState({ name: "", details: "" });

  const handleAddVendorSubmit = async (e) => {
    e.preventDefault();
    await onAddVendor(newVendor);
    setNewVendor({ name: "", username: "", password: "", phone: "", address: "" });
  };

  const handleAssignClientSubmit = async (e) => {
    e.preventDefault();

    if (!newClient.name || !selectedVendor?._id) {
      console.error("Client name or selected vendor ID is missing.");
      return;
    }

    try {
      const { name, details } = newClient;
      const id = selectedVendor._id;

      await adminAPI.post("/user/client", { name, details, id });
      fetchVendors();
      setNewClient({ name: "", details: "" });
      setShowAssignClientForm(false);
    } catch (error) {
      console.error("Error assigning client:", error);
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await adminAPI.delete(`/user/client/${clientId}`);
        fetchVendors();
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };

  return (
    <main className="flex-1 p-6">
      <h2 className="text-xl font-semibold mb-4">Welcome, {loggedInUser}</h2>

      {showAddVendorForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Add New Vendor</h3>
          <form onSubmit={handleAddVendorSubmit} className="space-y-4">
            {["name", "username", "password", "phone", "address"].map((field) => (
              <div key={field}>
                <label
                  htmlFor={field}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === "password" ? "password" : "text"}
                  id={field}
                  value={newVendor[field]}
                  onChange={(e) =>
                    setNewVendor({ ...newVendor, [field]: e.target.value })
                  }
                  className="w-full border rounded p-2"
                  required
                />
              </div>
            ))}
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition duration-300"
              >
                Add Vendor
              </button>
              <button
                type="button"
                onClick={onCancelAddVendor}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : selectedVendor ? (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <button
            onClick={onToggleAssignClientForm}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition duration-300 float-right m-5"
          >
            Assign New Client
          </button>
          {showAssignClientForm && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-4">
                Assign Client to {selectedVendor.name}
              </h3>
              <form onSubmit={handleAssignClientSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="ClientName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Client Name
                  </label>
                  <input
                    type="text"
                    id="ClientName"
                    value={newClient.name}
                    onChange={(e) =>
                      setNewClient({ ...newClient, name: e.target.value })
                    }
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="ClientDetails"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Details
                  </label>
                  <textarea
                    id="ClientDetails"
                    value={newClient.details}
                    onChange={(e) =>
                      setNewClient({ ...newClient, details: e.target.value })
                    }
                    className="w-full border rounded p-2"
                    rows="3"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300"
                  >
                    Assign Client
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAssignClientForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          <h3 className="text-lg font-semibold mb-2">{selectedVendor.name}</h3>
          <p className="text-gray-600 mb-4">{selectedVendor.address}</p>
          <h4 className="text-md font-semibold mb-2">Clients:</h4>
          {selectedVendor.clients.length > 0 ? (
            <ul className="list-disc pl-5 mb-4">
              {selectedVendor.clients.map((client) => (
                <li key={client._id} className="mb-2">
                  <span className="font-medium">{client.name}</span>
                  {client.name && (
                    <p className="text-sm text-gray-600 mt-1">
                      {client.details}
                    </p>
                  )}
                  <button
                    onClick={() => handleDeleteClient(client._id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-sm ml-2"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 mb-4">No Clients assigned yet.</p>
          )}
        </div>
      ) : (
        <p className="text-gray-600">
          Select a vendor to view details and assign clients.
        </p>
      )}
    </main>
  );
};

export default MainContent;