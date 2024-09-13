import mongoose from 'mongoose';

const {Schema} = mongoose;

const DiagnosticSchema = new Schema ({
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
  test: {type: String, required: true},
  bodyType: {type: String, required: true},
  reason: {type: String, required: true},
  priority: {type: String, required: true},
  instructions: {type: String, required: true},
  status: {type: String, required: true,default:"Pending"},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: null},
});

export default mongoose.models.Diagnostic ||
  mongoose.model ('Diagnostic', DiagnosticSchema);
