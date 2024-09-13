import mongoose from 'mongoose';

const {Schema} = mongoose;

const PaymentSchema = new Schema ({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  pharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  payFor: { type: String,required: true,unique:true},
  payType: { type: String,required: true,},
  amount: { type: String,required: true,},
  status: { type: String,default:"Pending"},
  transactionId: { type: String,required: true,unique:true},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: null},
});

export default mongoose.models.Payment ||
  mongoose.model ('Payment', PaymentSchema);
