import dbConnect from '../../../lib/dbConnect';
import PaymentGateway from '../../../models/PaymentGateway';

export default async function handler(req, res) {
  const { method, query } = req;
  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const paymentGateway = await PaymentGateway.findById(
          query.id
        ); /* find all the data in our database */
        res.status(200).json({ success: true, data: paymentGateway });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'DELETE':
      try {
        const paymentGateway = await PaymentGateway.deleteOne({
          _id: query.id,
        });
        res.status(200).json({ success: true, data: paymentGateway });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'PUT':
      try {
        const paymentGateway = await PaymentGateway.findById(query.id);
        if (paymentGateway && paymentGateway._id) {
          const updatePaymentGateway = await PaymentGateway.updateOne(
            {
              _id: paymentGateway._id,
            },
            {
              $set: { name: req.body.name },
            }
          );
          updatePaymentGateway.modifiedCount
            ? res.status(201).json({ success: true, data: paymentGateway })
            : res.status(400).json({ success: false });
        } else {
          res.status(400).json({ success: false });
        }
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
