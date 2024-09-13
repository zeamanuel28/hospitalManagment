import mongoose from "mongoose";

const { Schema } = mongoose;

const AlertSchema = new Schema({
  subject: { type: String,required:true },
  message: { type: String,required:true},
  to: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {type: String, required: true,default:"Pending"},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});

export default mongoose.models.Alert || mongoose.model("Alert", AlertSchema);