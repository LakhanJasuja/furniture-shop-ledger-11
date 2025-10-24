import React from 'react';
import './DebitComponent.css';

const DebitComponent = ({ transactions, addTransaction, deleteTransaction }) => {
    const filterTransactions = () => {
        if (!transactions || !Array.isArray(transactions)) return [];
        
        return transactions.filter(transaction => {
            const amount = parseFloat(transaction.amount) || 0;
            return (amount < 0) ;
        });
    };

    const debitTransactions = filterTransactions(); // Only negative amounts

    return (
        <div className="debit-component">
            <div className="debit-header">
                <h3 className="debit-title">Debit Transactions</h3>
                <button onClick={addTransaction}> Add </button>
            </div>

            <div className="debit-table-container">
                {debitTransactions.length > 0 ? (
                    <table className="debit-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {debitTransactions.map((transaction, index) => (
                                <tr key={index}>
                                    <td className="transaction-name">
                                        {transaction.name || 'N/A'}
                                    </td>
                                    <td className="transaction-description">
                                        {transaction.description || 'N/A'}
                                    </td>
                                    <td className="transaction-amount">
                                        ₹{Math.abs(parseFloat(transaction.amount)).toFixed(2)}
                                    </td>
                                    <td className="transaction-action">
                                        <button onClick={() => deleteTransaction(transaction)}> Delete </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="no-transactions">
                        <p>No debit transactions found for the selected date</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DebitComponent;
