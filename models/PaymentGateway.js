import mongoose from 'mongoose';

/* PetSchema will correspond to a collection in your MongoDB database. */
const PaymentGatewaySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a payment gateway name'],
  },
});

export default mongoose.models?.PaymentGateway ||
  mongoose.model('PaymentGateway', PaymentGatewaySchema);
