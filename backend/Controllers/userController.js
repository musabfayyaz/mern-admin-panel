const Client = require("../Models/Client");
const User = require("../Models/User");
const Vendor = require("../Models/Vendor");
const bcrypt = require('bcrypt');

const fetchVendors = async (req, res) => {
    try {
        const response = await Vendor.aggregate([
            {
                $lookup: {
                    from: 'clients',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'clients'
                }
            }
        ]);

        if (response.length === 0) {
            return res.json({ message: 'No Vendors Found' });
        }

        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

const addAdmin = async (req, res) => {
    try {
        const {name, username, password} = req.body;
        const role = 'admin';
        if(!name || !username || !password ){
            return res.status(400).json({message: 'Send Admin Info to ADD'});
        }
        const user = await User.findOne({ username });
        if (user) {
            return res.status(409).json({ message: "Admin already exists" });
        }
       
        const newAdmin = new User({ name, role, username, password });
        newAdmin.password = await bcrypt.hash(password, 10);
        await newAdmin.save();
        res.status(200).json({message: "Admin Created"});
    } catch (error) {
        res.status(500).json({message: 'Internal Server Error'});
        console.log(error.message);
    }
};

const addVendor = async (req, res) => {
    try {
        const {name, username, password, phone, address } = req.body;
        const role = 'vendor';
        if(!name || !username || !password || !phone || !address ){
            return res.status(400).json({message: 'Send Vendor Info to ADD'});
        }
        const user = await User.findOne({ username });
        if (user) {
            return res.status(409).json({ message: "Vendor already exists" });
        }

        const newUser = new User({ name, role, username, password });
        newUser.password = await bcrypt.hash(password, 10);
        await newUser.save();

        const vendor = new Vendor({ name, phone, address, userId: newUser._id });
        await vendor.save();
        
        res.status(200).json({message: "Vendor Created"});
    } catch (error) {
        res.status(500).json({message: 'Internal Server Error'});
        console.log(error.message);
    }
};

const assignClient = async (req, res) => {
    try {
        const { id, name, details } = req.body;

        const vendor = await Vendor.findById(id);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        const newClient = new Client({ userId: vendor._id, name, details });
        await newClient.save();

        console.log('Client saved:', newClient);

        res.status(200).json(newClient);
    } catch (error) {
        console.error('Error assigning client:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const removeVendor = async (req, res) => {
    try {
        const { id } = req.params;
        
        const vendor = await Vendor.findByIdAndDelete(id);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        await User.findByIdAndDelete(vendor.userId);
        await Client.deleteMany({ userId: vendor._id });

        res.status(200).json({ message: 'Vendor removed successfully' });
    } catch (error) {
        console.error('Error removing vendor:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        
        const client = await Client.findByIdAndDelete(id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.status(200).json({ message: 'Client deleted successfully' });
    } catch (error) {
        console.error('Error deleting client:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getVendorProfile = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ userId: req.user._id });
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        const clients = await Client.find({ userId: vendor._id });

        res.json({ vendor, clients });
    } catch (error) {
        console.error('Error fetching vendor profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateClientStatus = async (req, res) => {
    try {
        const { clientId } = req.params;
        const { status } = req.body;

        const vendor = await Vendor.findOne({ userId: req.user._id });
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        const client = await Client.findOneAndUpdate(
            { _id: clientId, userId: vendor._id },
            { status },
            { new: true }
        );

        if (!client) {
            return res.status(404).json({ message: 'Client not found or not associated with this vendor' });
        }

        res.json(client);
    } catch (error) {
        console.error('Error updating client status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateClientNote = async (req, res) => {
    try {
        const { clientId } = req.params;
        const { note } = req.body;

        const vendor = await Vendor.findOne({ userId: req.user._id });
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        const client = await Client.findOneAndUpdate(
            { _id: clientId, userId: vendor._id },
            { note },
            { new: true }
        );

        if (!client) {
            return res.status(404).json({ message: 'Client not found or not associated with this vendor' });
        }

        res.json(client);
    } catch (error) {
        console.error('Error updating client note:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { 
    fetchVendors, 
    addAdmin, 
    addVendor, 
    assignClient, 
    removeVendor, 
    deleteClient,
    getVendorProfile,
    updateClientStatus,
    updateClientNote
};