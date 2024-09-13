import mongoose from 'mongoose';

const {Schema} = mongoose;

const AppointmentSchema = new Schema ({
  //   patientId:{type: String,required: true },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  physicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  appointmentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  priority: {type: String, required: true},
  appointmentDate: {type: Date, required: true},
  startTime: {type: String, required: true},
  duration: {type: Number, required: true},
  status: {type: String, required: true, default: 'Pending'},
  description: {type: String, required: true},
  
  updatedBy: {type: String,default:''},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: null},
});

export default mongoose.models.Appointment ||
  mongoose.model ('Appointment', AppointmentSchema);
