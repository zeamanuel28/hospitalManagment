import mongoose from "mongoose";

const { Schema } = mongoose;

const VitalsSchema = new Schema({
  patientId:{type: String,required: true },
  triageId:{type: String,required: true },
  // patientId:{type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  complaint: { type: String ,required:true},
  symptoms: { type: String,required:true},
  medicalHistory: { type: String,required:true},

  symptomSeverity: { type: String,required:true},
  vitalsSigns: { type: String ,required:true},

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});

export default mongoose.models.Vitals || mongoose.model("Vitals", VitalsSchema);