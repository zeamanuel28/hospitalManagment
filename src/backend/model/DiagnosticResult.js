import mongoose from 'mongoose';

const {Schema} = mongoose;

const DiagnosticResultSchema = new Schema ({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  diagnosticId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  diagnosticTest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Diagnostic',
    required: true,
  },
  test: {type: String, required: true},
  findings: {type: String, required: true},
  conclusions: {type: String, required: true},
  image: {type: String},
  notes: {type: String, required: true},
  
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: null},
});

export default mongoose.models.DiagnosticResult ||
  mongoose.model ('DiagnosticResult', DiagnosticResultSchema);
