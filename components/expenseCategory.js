import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { mutate } from 'swr';

const Form = ({ formId, expenseCategoryObj, forNewExpenseCategory = true }) => {
  const router = useRouter();
  const contentType = 'application/json';
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    name: expenseCategoryObj.name,
  });

  /* The PUT method edits an existing entry in the mongodb database. */
  const putData = async (form) => {
    const { id } = router.query;

    try {
      const res = await fetch(`/api/expense-category/${id}`, {
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
      router.push('/expense-category');
    } catch (error) {
      setMessage('Failed to update pet');
    }
  };

  /* The POST method adds a new entry in the mongodb database. */
  const postData = async (form) => {
    try {
      const res = await fetch('/api/expense-category', {
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
      router.push('/expense-category');
    } catch (error) {
      setMessage('Failed to add pet');
    }
  };

  const handleChange = (e) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    setForm({
      ...form,
      [name]: value,
    });
  };

  /* Makes sure pet info is filled for pet name, owner name, species, and image url*/
  const formValidate = () => {
    let err = {};
    if (!form.name) err.name = 'Name is required';
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = formValidate();
    if (Object.keys(errs).length === 0) {
      forNewExpenseCategory ? postData(form) : putData(form);
    } else {
      setErrors({ errs });
    }
  };

  const fetchExpenseCategoryByID = async (id) => {
    try {
      const res = await fetch(`/api/expense-category/${id}`, {
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
      setForm({ name: data.name });
    } catch (error) {
      setMessage('Failed to update pet');
    }
  };

  useEffect(() => {
    if (!forNewExpenseCategory && router.query.id) {
      console.log();
      fetchExpenseCategoryByID(router.query.id);
    }
  }, [forNewExpenseCategory, router]);

  return (
    <>
      <form id={formId} onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
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
