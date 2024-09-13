import mongoose from 'mongoose';

const {Schema} = mongoose;

const ScheduleSchema = new Schema ({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {type: Date, required: true,unique:true},
  times: [{
    time: {type: String, required: true},
    status: {type: String, default: 'Open'},
  }],
  createdAt: {type: Date, default: Date.now},
  status: {type: String, default: 'Open'},
  updatedAt: {type: Date, default: null},
});

export default mongoose.models.Schedule ||
  mongoose.model ('Schedule', ScheduleSchema);
