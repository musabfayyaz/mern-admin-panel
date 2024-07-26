import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import SidebarToggle from "../components/SidebarToggle";
import RemoveVendorModal from "../components/RemoveVendorModal";
import adminAPI from "../services/api";

function Admin() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddVendorForm, setShowAddVendorForm] = useState(false);
  const [showRemoveVendorModal, setShowRemoveVendorModal] = useState(false);
  const [showAssignClientForm, setShowAssignClientForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    if (!user) {
      navigate("/login");
    } else {
      setLoggedInUser(user);
      fetchVendors();
    }
  }, [navigate]);

  const fetchVendors = async () => {
    try {
      const response = await adminAPI.get("/user/vendors");
      const vendorsWithReversedClients = response.data.map(vendor => ({
        ...vendor,
        clients: vendor.clients.reverse(),
      }));
  
      setVendors(vendorsWithReversedClients);
      if (selectedVendor) {
        const updatedSelectedVendor = vendorsWithReversedClients.find(
          vendor => vendor._id === selectedVendor._id
        );
        if (updatedSelectedVendor) {
          setSelectedVendor(updatedSelectedVendor);
        }
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  const handleVendorClick = (vendor) => {
    setSelectedVendor(vendor);
    setShowAddVendorForm(false);
    setShowAssignClientForm(false);
    setSidebarOpen(false);
  };

  const handleAddVendor = async (newVendor) => {
    try {
      const response = await adminAPI.post("/user/vendor", newVendor);
      if (response.status === 200) {
        fetchVendors();
        setShowAddVendorForm(false);
      }
    } catch (error) {
      console.error('Error adding vendor:', error);
    }
  };

  const handleRemoveVendor = async (vendorId) => {
    try {
      const response = await adminAPI.delete(`/user/vendor/${vendorId}`);
      if (response.status === 200) {
        setVendors((prevVendors) =>
          prevVendors.filter((vendor) => vendor._id !== vendorId)
        );
        if (selectedVendor && selectedVendor._id === vendorId) {
          setSelectedVendor(null);
        }
      }
    } catch (error) {
      console.error('Error removing vendor:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        vendors={vendors}
        selectedVendor={selectedVendor}
        onVendorClick={handleVendorClick}
        onAddVendor={() => setShowAddVendorForm(true)}
        onRemoveVendor={() => setShowRemoveVendorModal(true)}
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col md:ml-64">
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <SidebarToggle onClick={() => setSidebarOpen(!sidebarOpen)} />
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-300"
          >
            Logout
          </button>
        </header>
        <main className="flex-1 p-6">
          <MainContent
            loggedInUser={loggedInUser}
            fetchVendors={fetchVendors}
            selectedVendor={selectedVendor}
            vendors={vendors}
            setVendors={setVendors}
            showAddVendorForm={showAddVendorForm}
            showAssignClientForm={showAssignClientForm}
            onAddVendor={handleAddVendor}
            onCancelAddVendor={() => setShowAddVendorForm(false)}
            onToggleAssignClientForm={() => setShowAssignClientForm(!showAssignClientForm)}
            setShowAssignClientForm={setShowAssignClientForm}
          />
        </main>
        {showRemoveVendorModal && (
          <RemoveVendorModal
            vendors={vendors}
            onRemove={handleRemoveVendor}
            onClose={() => setShowRemoveVendorModal(false)}
          />
        )}
      </div>
    </div>
  );
}

export default Admin;