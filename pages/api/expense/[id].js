import dbConnect from '../../../lib/dbConnect';
import Expense from '../../../models/Expense';

export default async function handler(req, res) {
  const { method, query } = req;
  await dbConnect();
  console.log('handler query.id', query.id);
  switch (method) {
    case 'GET':
      try {
        const expense = await Expense.findById(
          query.id
        ); /* find all the data in our database */
        res.status(200).json({ success: true, data: expense });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'DELETE':
      try {
        console.log('query.id', query.id);
        const expense = await Expense.deleteOne({ _id: query.id });
        res.status(200).json({ success: true, data: expense });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'PUT':
      try {
        const {
          expense_type,
          bank,
          payment_gateway,
          isDebited,
          amount,
          description,
          date,
        } = req.body;
        const expense = await Expense.findById(query.id);
        if (expense && expense._id) {
          const updateExpense = await Expense.updateOne(
            {
              _id: expense._id,
            },
            {
              $set: {
                expense_type,
                bank,
                payment_gateway,
                isDebited,
                amount,
                description,
                date,
              },
            }
          );
          updateExpense.modifiedCount
            ? res.status(201).json({ success: true, data: expense })
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
