import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { mutate } from 'swr';

const Form = ({ formId, paymentGatewayObj, forNewPaymentGateway = true }) => {
  const router = useRouter();
  const contentType = 'application/json';
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    name: paymentGatewayObj.name,
  });

  /* The PUT method edits an existing entry in the mongodb database. */
  const putData = async (form) => {
    const { id } = router.query;

    try {
      const res = await fetch(`/api/payment-gateway/${id}`, {
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
      router.push('/payment-gateway');
    } catch (error) {
      setMessage('Failed to update payment gateway');
    }
  };

  /* The POST method adds a new entry in the mongodb database. */
  const postData = async (form) => {
    try {
      const res = await fetch('/api/payment-gateway', {
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

      router.push('/payment-gateway');
    } catch (error) {
      setMessage('Failed to add payment gateway');
    }
  };

  const formValidate = () => {
    let err = {};
    if (!form.name) err.name = 'Name is required';
    return err;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = formValidate();
    if (Object.keys(errs).length === 0) {
      forNewPaymentGateway ? postData(form) : putData(form);
    } else {
      setErrors({ errs });
    }
  };

  const fetchPaymentGatewayByID = async (id) => {
    try {
      const res = await fetch(`/api/payment-gateway/${id}`, {
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
      setMessage('Failed to update payment gateway');
    }
  };

  useEffect(() => {
    if (!forNewPaymentGateway && router.query.id) {
      fetchPaymentGatewayByID(router.query.id);
    }
  }, [forNewPaymentGateway, router]);

  return (
    <>
      <form id={formId} onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={(e) => setForm({ name: e.target.value })}
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
