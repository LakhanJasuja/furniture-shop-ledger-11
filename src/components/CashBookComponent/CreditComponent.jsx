    import './CreditComponent.css';

const CreditComponent = ({ transactions, deleteTransaction, addTransaction }) => {
    const filterTransactions = () => {
        if (!transactions || !Array.isArray(transactions)) return [];
        return transactions.filter(transaction => {
            const amount = parseFloat(transaction.amount) || 0;
            return (amount > 0);
        });
    };

    const creditTransactions = filterTransactions();

    return (
        <div className="credit-component">
            <div className="credit-header">
                <h3 className="credit-title">Credit Transactions</h3>
                <button onClick={addTransaction}> Add </button>
            </div>

            <div className="credit-table-container">
                {creditTransactions.length > 0 ? (
                    <table className="credit-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {creditTransactions.map((transaction, index) => (
                                <tr key={index}>
                                    <td className="transaction-name">
                                        {transaction.name || 'N/A'}
                                    </td>
                                    <td className="transaction-description">
                                        {transaction.description || 'N/A'}
                                    </td>
                                    <td className="transaction-amount">
                                        ₹{parseFloat(transaction.amount).toFixed(2)}
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
                        <p>No credit transactions found for the selected date</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreditComponent;
