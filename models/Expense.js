import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  expense_type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExpenseType',
    required: [true, 'Please provide a expense type name.'],
  },
  bank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bank',
    required: [true, 'Please provide a bank name.'],
  },
  payment_gateway: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentGateway',
    required: [true, 'Please provide a payment gateway.'],
  },
  isDebited: {
    type: Boolean,
    required: [true, 'Amount is debited / credited required.'],
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required.'],
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
  },
});

export default mongoose.models?.Expense ||
  mongoose.model('Expense', ExpenseSchema);
