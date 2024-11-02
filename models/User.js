const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  pan: {
    type: String,
    required: true,
    unique: true,
  },
  aadhaar: {
    type: String,
    required: true,
    unique: true,
  },
  classXRollNo: {
    type: String,
    required: true,
  },
  maritalStatus: {
    type: String,
    enum: ['single', 'married'],
    required: true,
  },
  numberOfChildren: {
    type: Number,
    default: 0,
  },
  marriageCertificateNumber: {
    type: String,
  },
});

module.exports = mongoose.model('User', UserSchema);
