import mongoose from 'mongoose';

/* BankSchema will correspond to a collection in your MongoDB database. */
const BankSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a bank name'],
  },
});

export default mongoose.models?.Bank || mongoose.model('Bank', BankSchema);
