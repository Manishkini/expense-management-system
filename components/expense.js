import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { mutate } from 'swr';

const Form = ({ formId, expenseObj, forNewExpense = true }) => {
  const router = useRouter();
  const contentType = 'application/json';
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const [expenseCategories, setExpenseCategories] = useState([]);
  const [paymentGateways, setPaymentGateways] = useState([]);
  const [banks, setBanks] = useState([]);

  const [form, setForm] = useState({
    expense_type: expenseObj.expense_type,
    bank: expenseObj.bank,
    payment_gateway: expenseObj.payment_gateway,
    isDebited: expenseObj.isDebited,
    amount: expenseObj.amount,
    description: expenseObj.description,
    date: expenseObj.date,
  });

  /* The PUT method edits an existing entry in the mongodb database. */
  const putData = async (form) => {
    const { id } = router.query;

    try {
      const res = await fetch(`/api/expense/${id}`, {
        method: 'PUT',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
        body: JSON.stringify(form),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status);
      }

      const { data } = await res.json();

      mutate(`/api/expense/${id}`, data, false); // Update the local data without a revalidation
      router.push('/');
    } catch (error) {
      setMessage('Failed to update expense');
    }
  };

  /* The POST method adds a new entry in the mongodb database. */
  const postData = async (form) => {
    try {
      const res = await fetch('/api/expense', {
        method: 'POST',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
        body: JSON.stringify(form),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status);
      }

      router.push('/');
    } catch (error) {
      setMessage('Failed to add expense');
    }
  };

  const handleChange = (e) => {
    const target = e.target;
    const value = target.name === 'isDebited' ? target.checked : target.value;
    const name = target.name;
    console.log('target.name', target.value);
    setForm({
      ...form,
      [name]: value,
    });
  };

  /* Makes sure expense info is filled for expense name, owner name, species, and image url*/
  const formValidate = () => {
    let err = {};
    if (!form.expense_type) err.expense_type = 'Expense Category is required';
    if (!form.bank) err.bank = 'Bank is required';
    if (!form.payment_gateway)
      err.payment_gateway = 'Payment Gateway is required';
    if (!form.amount) err.amount = 'Amount is required';
    if (!form.date) err.date = 'Date is required';
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = formValidate();
    if (Object.keys(errs).length === 0) {
      forNewExpense ? postData(form) : putData(form);
    } else {
      setErrors({ errs });
    }
  };

  const getExpenseCategories = async () => {
    try {
      const res = await fetch(`/api/expense-category`, {
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

      setExpenseCategories(data);
    } catch (error) {
      setMessage('Failed to fetch expense categories');
    }
  };

  const getPaymentGateways = async () => {
    try {
      const res = await fetch(`/api/payment-gateway`, {
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

      setPaymentGateways(data);
    } catch (error) {
      setMessage('Failed to fetch payment gateway');
    }
  };

  const getBanks = async () => {
    try {
      const res = await fetch(`/api/bank`, {
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

      setBanks(data);
    } catch (error) {
      setMessage('Failed to fetch banks');
    }
  };

  useEffect(() => {
    getExpenseCategories();
    getPaymentGateways();
    getBanks();
  }, []);

  const fetchExpenseByID = async (id) => {
    try {
      const res = await fetch(`/api/expense/${id}`, {
        method: 'GET',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      const { data } = await res.json();
      setForm({
        expense_type: data.expense_type,
        bank: data.bank,
        payment_gateway: data.payment_gateway,
        isDebited: data.isDebited,
        amount: data.amount,
        description: data.description,
        date: new Date(data.date).toISOString().slice(0, 16),
      });
    } catch (error) {
      setMessage('Failed to update expense');
    }
  };

  useEffect(() => {
    if (!forNewExpense && router.query.id) {
      fetchExpenseByID(router.query.id);
    }
  }, [forNewExpense, router]);

  return (
    <>
      <form id={formId} onSubmit={handleSubmit}>
        <label htmlFor="expense_type">Expense Category</label>
        <select
          name="expense_type"
          value={form.expense_type}
          onChange={handleChange}
          required
        >
          <option disabled selected value="">
            Please Select Expense Type
          </option>
          {expenseCategories.map((expenseCategory) => (
            <option key={expenseCategory._id} value={expenseCategory._id}>
              {expenseCategory.name}
            </option>
          ))}
        </select>

        <label htmlFor="payment_gateway">Payment Gateway</label>
        <select
          name="payment_gateway"
          value={form.payment_gateway}
          onChange={handleChange}
          required
        >
          <option disabled selected value="">
            Please Select Payment Gateway
          </option>
          {paymentGateways.map((paymentGateway) => (
            <option key={paymentGateway._id} value={paymentGateway._id}>
              {paymentGateway.name}
            </option>
          ))}
        </select>

        <label htmlFor="bank">Bank</label>
        <select name="bank" value={form.bank} onChange={handleChange} required>
          <option disabled selected value="">
            Please Select Bank
          </option>
          {banks.map((bank) => (
            <option key={bank._id} value={bank._id}>
              {bank.name}
            </option>
          ))}
        </select>

        <label htmlFor="isDebited">Amount Debited?</label>
        <input
          type="checkbox"
          name="isDebited"
          checked={form.isDebited}
          onChange={handleChange}
        />

        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <label htmlFor="date">Date</label>
        <input
          type="datetime-local"
          name="date"
          maxLength="60"
          value={form.date}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn">
          Submit
        </button>
      </form>
      <p>{message}</p>
      <div>
        {Object.keys(errors).map((err, index) => (
          <li key={index}>{err}</li>
        ))}
      </div>
    </>
  );
};

export default Form;
