import mongoose from "mongoose";

const { Schema } = mongoose;

const AssignDocSchema = new Schema({
  patientId:{type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  priorty: { type: String,required:true },
  department: { type: String,required:true},
  physician: { type: String,required:true},
  triage: { type: String,required:true},
  status: {type: String, required: true,default:"Pending"},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});

export default mongoose.models.AssignDoc || mongoose.model("AssignDoc", AssignDocSchema);