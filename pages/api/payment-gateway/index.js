import dbConnect from '../../../lib/dbConnect';
import PaymentGateway from '../../../models/PaymentGateway';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const paymentGateways = await PaymentGateway.find(
          {}
        ); /* find all the data in our database */
        res.status(200).json({ success: true, data: paymentGateways });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const paymentGateway = await PaymentGateway.create(
          req.body
        ); /* create a new model in the database */
        res.status(201).json({ success: true, data: paymentGateway });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
