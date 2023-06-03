import dbConnect from '../../../lib/dbConnect';
import ExpenseTypes from '../../../models/ExpenseTypes';

export default async function handler(req, res) {
  const { method, query } = req;
  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const ExpenseType = await ExpenseTypes.findById(
          query.id
        ); /* find all the data in our database */
        res.status(200).json({ success: true, data: ExpenseType });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'DELETE':
      try {
        const ExpenseType = await ExpenseTypes.deleteOne({ _id: query.id });
        res.status(200).json({ success: true, data: ExpenseType });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'PUT':
      try {
        const ExpenseType = await ExpenseTypes.findById(query.id);
        if (ExpenseType && ExpenseType._id) {
          const updateExpenseType = await ExpenseTypes.updateOne(
            {
              _id: ExpenseType._id,
            },
            {
              $set: { name: req.body.name },
            }
          );
          updateExpenseType.modifiedCount
            ? res.status(201).json({ success: true, data: ExpenseType })
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
