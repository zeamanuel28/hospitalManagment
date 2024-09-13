import mongoose from "mongoose";

const { Schema } = mongoose;

const PatientLogSchema = new Schema({
  type: { type: String,required:true },
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.PatientLog || mongoose.model("PatientLog", PatientLogSchema);