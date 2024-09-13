import mongoose from "mongoose";

const { Schema } = mongoose;

const PatientSchema = new Schema({
  IdNo: { type: String,unique: true,required:true },
  fullName: { type: String ,required:true},
  sex: { type: String,required:true},
  dateOfBirth: { type: Date,required:true},
  bloodType: { type: String},
  email: { type: String,unique: true},
  phone: { type: String,required:true,unique: true},
  city: { type: String ,required:true},
  subCity: { type: String ,required:true},
  emergencyContactName: { type: String ,required:true},
  emergencyContactPhone: { type: String ,required:true},
  emergencyContactRelationship: { type: String ,required:true},

  token: { type: String, default: null},
  password: { type: String},

  status: { type: String, default:"Active"},

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});

export default mongoose.models.Patient || mongoose.model("Patient", PatientSchema);