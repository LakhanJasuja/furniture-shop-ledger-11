// src/components/BuyerTransactions.js
import { useEffect, useState } from 'react';
import { supabase } from '../client/supabaseClient';

export default function BuyerData({ id = 1}) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchTransactions() {
      const { data, error } = await supabase
        .from('BuyerData')
        .select('*');

      if (error) console.error(error);
      else {
        console.log("data is : " + data);
        setTransactions(data);
      }
    }

    fetchTransactions();
  }, []);

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Transactions</h2>
      <ul className="space-y-2">
        {transactions.map(tx => (
          <li key={tx.id} className="border p-2 rounded">
            {tx.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
