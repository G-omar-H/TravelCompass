// scripts/createSuperAdmin.js
const mongoose = require('mongoose');
const User = require('../models/User');

const mongoURI = 'mongodb://127.0.0.1:27017/travelcompass'; // Replace with your actual connection string

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createSuperAdmin = async () => {
  try {
    const superAdmin = new User({
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password: 'superadminpassword',
      isSuperAdmin: true,
      isAdmin: true,
      roles: ['admin'],
    });

    await superAdmin.save();
    console.log('Super Admin created successfully');
  } catch (error) {
    console.error('Error creating Super Admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

createSuperAdmin();
