import { useState, useEffect } from "react";
import { supabase } from '../../client/supabaseClient';
import './DisplayBalance.css';

const DisplayBalance = ({cashType}) => {
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        fetchBalance();
    }, []);
    
    const fetchBalance = async () => {
        try {
        // Fetch all {cashType} transactions to calculate balance
        const { data, error } = await supabase
            .from('Transactions')
            .select('amount, transactionType')
            .eq('transactionType', cashType);
    
        if (error) {
            console.error('Error fetching cash balance:', error.message);
            setBalance(0);
        } else {
            const totalCash = data.reduce((total, transaction) => {
              return total + (parseFloat(transaction.amount) || 0);
            }, 0);
            setBalance(totalCash);
          }
        } catch (err) {
          console.error('Error calculating cash balance:', err.message);
          setBalance(0);
        }
    };

    return ( <div className="balance-card">
        <div className="balance-header">
          <h2 >Balance</h2>
          <div className="balance-amount">
            <span className="currency">₹</span>
            <span className={`amount ${balance >= 0 ? 'positive' : 'negative'}`}>
              {Math.abs(balance).toFixed(2)}
            </span>
          </div>
        </div>
      </div> 
    );
}
 
export default DisplayBalance;
