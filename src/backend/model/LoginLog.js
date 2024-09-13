import mongoose from "mongoose";

const { Schema } = mongoose;

const LoginLogSchema = new Schema({
  type: { type: String,required:true },
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.LoginLog || mongoose.model("LoginLog", LoginLogSchema);