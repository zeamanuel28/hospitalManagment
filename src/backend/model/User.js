import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
  IdNo: { type: String,unique: true,required:true },
  fullName: { type: String ,required:true},
  phone: { type: String,required:true},
  sex: { type: String,required:true},

  email: { type: String,required:true},
  password: { type: String,required:true },
  role: { type: String ,required:true},
  department: { type: String},

  token: { type: String, default: null},

  status: { type: String, default:"Active"},

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);