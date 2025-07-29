import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Product', 'Service', 'Support'], required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
  dateSubmitted: { type: Date, default: Date.now },
  dateUpdated: { type: Date, default: null },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
