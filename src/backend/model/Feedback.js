import mongoose from "mongoose";

const { Schema } = mongoose;

const FeedbackSchema = new Schema({
  subject: { type: String,required:true },
  message: { type: String,required:true},
  type: { type: String,required:true},
  from: {type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  // status: {type: String, required: true,default:"Pending"},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});

export default mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);