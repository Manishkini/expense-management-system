import mongoose from 'mongoose';

const ExpenseTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a expense type name'],
  },
});

export default mongoose.models?.ExpenseType ||
  mongoose.model('ExpenseType', ExpenseTypeSchema);
