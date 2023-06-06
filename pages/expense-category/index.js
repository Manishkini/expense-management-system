import Link from 'next/link';
import { useEffect, useState } from 'react';
import dbConnect from '../../lib/dbConnect';
import { useRouter } from 'next/router';
import CustomModal from '../../components/deleteModal';
import { ExpenseType } from '../../models/index.js';

const PaymentGatewayList = ({ ExpenseTypes }) => {
  const contentType = 'application/json';
  const router = useRouter();
  const [id, setID] = useState(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [expenseTypeList, setExpenseTypeList] = useState([]);

  const deleteRecord = async () => {
    try {
      const res = await fetch(`/api/expense-category/${id}`, {
        method: 'DELETE',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status);
      }

      router.push('/expense-category');
    } catch (error) {
      console.log('Failed to delete expense category', error);
    }
  };
  useEffect(() => {
    if (ExpenseTypes && ExpenseTypes.length) {
      setExpenseTypeList(ExpenseTypes);
    }
  }, [ExpenseTypes]);
  return (
    <>
      {' '}
      <section className="w-1/2">
        <table className="w-full table-auto border-collapse bg-slate-50 border border-slate-500">
          <caption className="caption-top text-center">
            Expense Category List
          </caption>
          <thead className="bg-slate-500 h-16">
            <tr>
              <th className="w-2/3 border border-slate-600">Name</th>
              <th className="w-1/3 border border-slate-600" colSpan="2">
                <button className="add-buttons">
                  <Link href="/expense-category/new">Add Expense Category</Link>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {expenseTypeList.map((expenseType, index) => (
              <tr key={index} className="font-light text-center h-10">
                <td className="border border-slate-700">{expenseType.name}</td>
                <td className="border border-slate-700">
                  <button className="edit-buttons">
                    <Link href={`/expense-category/${expenseType.id}`}>
                      Edit
                    </Link>
                  </button>
                </td>
                <td className="border border-slate-700">
                  <button
                    className="delete-buttons"
                    onClick={() => {
                      setIsOpen(true);
                      setID(expenseType.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <CustomModal
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        deleteRecord={deleteRecord}
        content={<h2>Are you sure? you want to delete this expense?</h2>}
      />
    </>
  );
};

/* Retrieves payment gateways(s) data from mongodb database */
export async function getServerSideProps() {
  await dbConnect();
  let ExpenseTypes = await ExpenseType.find({});
  ExpenseTypes = ExpenseTypes.map((expenseType) => {
    expenseType = JSON.parse(JSON.stringify(expenseType));
    const tempPaymentGateway = {
      id: expenseType._id,
      name: expenseType.name,
    };
    return tempPaymentGateway;
  });
  return { props: { ExpenseTypes } };
  // return { props: { expenses: [] } };
}

export default PaymentGatewayList;
