import Link from 'next/link';
import dbConnect from '../lib/dbConnect';
import { Expense } from '../models/index';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import CustomModal from '../components/deleteModal';

const Index = ({ expenses, totalExpenseOfTheMonth }) => {
  const contentType = 'application/json';
  const router = useRouter();
  const [id, setID] = useState(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [totalExpense, setTotalExpense] = useState(totalExpenseOfTheMonth);
  const [expenseList, setExpenseList] = useState([]);

  const understoodData = (data) => {
    let totalExpenseOfTheMonth = 0;
    data = data.map((expense) => {
      expense = JSON.parse(JSON.stringify(expense));
      const tempExpense = {
        id: expense._id,
        date: expense.date,
        expense_type: expense.expense_type.name,
        bank: expense.bank.name,
        payment_gateway: expense.payment_gateway.name,
        debit: expense.isDebited ? expense.amount : '-',
        credit: !expense.isDebited ? expense.amount : '-',
      };
      totalExpenseOfTheMonth = expense.isDebited
        ? totalExpenseOfTheMonth + expense.amount
        : totalExpenseOfTheMonth - expense.amount;
      return tempExpense;
    });
    setExpenseList(data);
    setTotalExpense(totalExpenseOfTheMonth);
  };

  const deleteRecord = async () => {
    try {
      const res = await fetch(`/api/expense/${id}`, {
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

      router.push('/');
    } catch (error) {
      console.log('Failed to delete expense', error);
    }
  };

  const search = async (search) => {
    console.log('search', search);
    try {
      const res = await fetch(`/api/search/${search}`, {
        method: 'GET',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status);
      }

      const { data } = await res.json();
      understoodData(data);
    } catch (error) {
      console.log('Failed to add bank', error);
    }
  };

  useEffect(() => {
    if (expenses && expenses.length) {
      setExpenseList(expenses);
    }
  }, [expenses]);
  return (
    <>
      {/* Header section for Expenses */}
      <section className="flex flex-row h-16 w-full gap-1 border-b-2 border-neutral-900">
        <div className="w-1/4">
          <div className="flex flex-row justify-center items-center h-16">
            <input
              className="w-2/3"
              type="search"
              name="search"
              placeholder="Search anything"
              onChange={(e) => search(e.target.value)}
            />
          </div>
        </div>
        <div className="w-3/4">
          <div className="flex flex-row justify-end items-center h-16 mr-20 gap-4">
            <button className="add-buttons">
              <Link href="/expense/new">Add Expense</Link>
            </button>
            <button className="add-buttons">
              <Link href="/bank/new">Add Bank</Link>
            </button>
            <button className="add-buttons">
              <Link href="/payment-gateway/new">Add Modes of Payment</Link>
            </button>
            <button className="add-buttons">
              <Link href="/expense-category/new">Add Expense Category</Link>
            </button>
          </div>
        </div>
      </section>
      {/* Table for Expenses */}
      <section className="w-full">
        <table className="w-full table-auto border-collapse bg-slate-50 border border-slate-500">
          <caption className="caption-top text-center">
            Expense Management Table from 1 June 2023 - 30 June 2023
          </caption>
          <thead className="bg-slate-500 h-16">
            <tr>
              <th className="w-2/12 border border-slate-600">Date</th>
              <th className="w-2/12 border border-slate-600">Expense Type</th>
              <th className="w-2/12 border border-slate-600">Bank</th>
              <th className="w-2/12 border border-slate-600">
                Payment Gateway
              </th>
              <th className="w-1/12 border border-slate-600">
                Debit{` \u20B9`}
              </th>
              <th className="w-1/12 border border-slate-600">
                Credit {` \u20B9`}
              </th>
              <th className="w-2/12 border border-slate-600" colSpan="2"></th>
            </tr>
          </thead>
          <tbody>
            {expenseList.map((expense, index) => (
              <tr key={index} className="font-light text-center h-10">
                <td className="border border-slate-700">
                  {moment(expense.date).format('DD-MMM-YYYY hh:mm A')}
                </td>
                <td className="border border-slate-700">
                  {expense.expense_type}
                </td>
                <td className="border border-slate-700">{expense.bank}</td>
                <td className="border border-slate-700">
                  {expense.payment_gateway}
                </td>
                <td className="border border-slate-700">{expense.debit}</td>
                <td className="border border-slate-700">{expense.credit}</td>
                <td className="border border-slate-700">
                  <button className="edit-buttons">
                    <Link href={`/expense/${expense.id}`}>Edit</Link>
                  </button>
                </td>
                <td className="border border-slate-700">
                  <button
                    className="delete-buttons"
                    onClick={() => {
                      setIsOpen(true);
                      setID(expense.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <caption className="caption-bottom  text-center">
            Total Expense: {totalExpense}
            {' \u20B9'}
          </caption>
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

export async function getServerSideProps() {
  await dbConnect();
  let expenses = await Expense.find({})
    .populate(['expense_type', 'bank', 'payment_gateway'])
    .sort({ date: -1 });
  let totalExpenseOfTheMonth = 0;
  expenses = expenses.map((expense) => {
    expense = JSON.parse(JSON.stringify(expense));
    const tempExpense = {
      id: expense._id,
      date: expense.date,
      expense_type: expense.expense_type.name,
      bank: expense.bank.name,
      payment_gateway: expense.payment_gateway.name,
      debit: expense.isDebited ? expense.amount : '-',
      credit: !expense.isDebited ? expense.amount : '-',
    };
    totalExpenseOfTheMonth = expense.isDebited
      ? totalExpenseOfTheMonth + expense.amount
      : totalExpenseOfTheMonth - expense.amount;
    return tempExpense;
  });
  return { props: { expenses, totalExpenseOfTheMonth } };
}

export default Index;
