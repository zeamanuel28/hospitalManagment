import mongoose from 'mongoose';
import Patient from './Patient';

const {Schema} = mongoose;

const PrescriptionSchema = new Schema ({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  physicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {type: String, default:'Pending'},
  paymentTid: {type: String, default:'not paid'},
  medications: [{
    name: {type: String, required: true},
    dosage: {type: String, required: true},
    quantity: {type: String, required: true},
  }],
  instruction: {type: String, required: true},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: null},
});

export default mongoose.models.Prescription ||
  mongoose.model ('Prescription', PrescriptionSchema);
