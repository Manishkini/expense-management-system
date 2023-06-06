import Link from 'next/link';
import { useEffect, useState } from 'react';
import dbConnect from '../../lib/dbConnect';
import { useRouter } from 'next/router';
import CustomModal from '../../components/deleteModal';
import { Bank } from '../../models/index.js';

const PaymentGatewayList = ({ banks }) => {
  const contentType = 'application/json';
  const router = useRouter();
  const [id, setID] = useState(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [bankList, setBankList] = useState([]);

  const deleteRecord = async () => {
    try {
      const res = await fetch(`/api/bank/${id}`, {
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

      router.push('/bank');
    } catch (error) {
      console.log('Failed to delete bank', error);
    }
  };

  useEffect(() => {
    if (banks && banks.length) {
      setBankList(banks);
    }
  }, [banks]);
  return (
    <>
      <section className="w-1/2">
        <table className="w-full table-auto border-collapse bg-slate-50 border border-slate-500">
          <caption className="caption-top text-center">Bank List</caption>
          <thead className="bg-slate-500 h-16">
            <tr>
              <th className="w-2/3 border border-slate-600">Name</th>
              <th className="w-1/3 border border-slate-600" colSpan="2">
                <button className="add-buttons">
                  <Link href="/bank/new">Add Bank</Link>
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {bankList.map((bank, index) => (
              <tr key={index} className="font-light text-center h-10">
                <td className="border border-slate-700">{bank.name}</td>
                <td className="border border-slate-700">
                  <button className="edit-buttons">
                    <Link href={`/bank/${bank.id}`}>Edit</Link>
                  </button>
                </td>
                <td className="border border-slate-700">
                  <button
                    className="delete-buttons"
                    onClick={() => {
                      setIsOpen(true);
                      setID(bank.id);
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
  let banks = await Bank.find({});
  banks = banks.map((bank) => {
    bank = JSON.parse(JSON.stringify(bank));
    const tempPaymentGateway = {
      id: bank._id,
      name: bank.name,
    };
    return tempPaymentGateway;
  });
  return { props: { banks } };
  // return { props: { expenses: [] } };
}

export default PaymentGatewayList;
