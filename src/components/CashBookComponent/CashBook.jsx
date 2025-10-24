import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from "./Calendar";
import CreditComponent from "./CreditComponent";
import DebitComponent from './DebitComponent';
import { supabase } from '../../client/supabaseClient';
import './CashBook.css';

const CashBook = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [showCalendar, setShowCalendar] = useState(false);
    const [transactions, setTransactions] = useState([]);
    
    useEffect(() => {
        fetchTransactions();
    }, []);
        
    const fetchTransactions = async () => {
        try {
            const { data, error } = await supabase
                .from('Transactions')
                .select('transactionId, amount, transactionType, name, transactionDate, description')
                .eq('transactionType', "CASH");
        
            if (error) {
                console.error('Error fetching transactions:', error.message);
                setTransactions([]);
            } else {
                console.log("Fetched transactions:", data);
                setTransactions(data);
              }
        } catch (err) {
            console.error('Error fetching transactions:', err.message);
            setTransactions([]);
        }
    };

    const calculateBalance = () => {
        const totalCash = transactions.reduce((total, transaction) => {
            return total + (parseFloat(transaction.amount) || 0);
        }, 0);
        return totalCash.toFixed(2);
    }

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setShowCalendar(false); // Close calendar after selection
    };

    const formatSelectedDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };

    const getTransactionsOnSelectedDate = () => {
        const filteredTransactions = transactions.filter((transaction) => {
            // Convert both dates to the same format for comparison
            const transactionDate = new Date(transaction.transactionDate).toISOString().split('T')[0];
            return transactionDate === selectedDate;
        });
        console.log("Filtered transactions:", filteredTransactions);
        return filteredTransactions;
    }

    const deleteTransaction = async (transactionToDelete) => {
        if (!transactionToDelete.transactionId) {
            console.error('Cannot delete transaction: No ID provided');
            alert('Error: Cannot delete transaction without ID');
            return;
        }
        
        try {
            const { data, error } = await supabase
                .from('Transactions')
                .delete()
                .eq('transactionId', transactionToDelete.transactionId);
        
            if (error) {
                console.error('Error deleting transaction:', error.message);
                alert('Error deleting transaction: ' + error.message);
            } else {
                console.log("Transaction deleted successfully:", data);
                alert('Transaction deleted successfully!');
                // Refresh transactions after deletion
                fetchTransactions();
            }
        } catch (err) {
            console.error('Error deleting transaction:', err.message);
            alert('Error deleting transaction: ' + err.message);
        }
    }

    const addTransaction = async () => {
        navigate('/cash-records');
    }


    return (
        <div className="cashbook-container">
            <div className="top-section">
                <div className="date-selection-form">
                    <div className="form-group">
                        <div className="date-selector" onClick={toggleCalendar}>
                            <span className="date-label">Select a Date:</span>
                            <span className="selected-date">{formatSelectedDate(selectedDate)}</span>
                            <span className="dropdown-arrow">{showCalendar ? '▲' : '▼'}</span>
                        </div>
                        
                        {showCalendar && (
                            <div className="calendar-dropdown">
                                <Calendar 
                                    selectedDate={selectedDate}
                                    onDateSelect={handleDateSelect}
                                />
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="balance-display">
                    <h2>Balance : ₹{calculateBalance()}</h2>
                </div>
            </div>

            <div className="credit-section">
                <CreditComponent transactions={getTransactionsOnSelectedDate()} deleteTransaction = {deleteTransaction} addTransaction={addTransaction}/>
                <DebitComponent transactions={getTransactionsOnSelectedDate()} addTransaction={addTransaction} deleteTransaction={deleteTransaction} />
            </div>
        </div>
    );
}
 
export default CashBook;
