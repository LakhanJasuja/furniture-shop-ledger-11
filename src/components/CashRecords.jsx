import React, { useState, useEffect } from 'react';
import { supabase } from '../client/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import './CashRecords.css';

const CashRecords = () => {
  const [cashBalance, setCashBalance] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [showExpenseForm, setShowExpenseForm] = useState(true);
  const [expenseData, setExpenseData] = useState({
    customerName: '',
    cashInOut: '',
    description: '',
    amount: '',
    date: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchCashBalance();
    fetchCustomers();
    fetchRecentTransactions();
  }, []);

  const fetchCashBalance = async () => {
    try {
      // Fetch all CASH transactions to calculate balance
      const { data, error } = await supabase
        .from('Transactions')
        .select('amount, transactionType')
        .eq('transactionType', 'CASH');

      if (error) {
        console.error('Error fetching cash balance:', error.message);
        setCashBalance(0);
      } else {
        const totalCash = data.reduce((total, transaction) => {
          return total + (parseFloat(transaction.amount) || 0);
        }, 0);
        setCashBalance(totalCash);
      }
    } catch (err) {
      console.error('Error calculating cash balance:', err.message);
      setCashBalance(0);
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('CustomersData')
        .select('id, name')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching customers:', error.message);
        setCustomers([]);
      } else {
        setCustomers(data || []);
      }
    } catch (err) {
      console.error('Error fetching customers:', err.message);
      setCustomers([]);
    }
  };

  const fetchRecentTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('Transactions')
        .select('name, description, transactionDate, amount, created_at')
        .eq('transactionType', 'CASH')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching recent transactions:', error.message);
        setRecentTransactions([]);
      } else {
        setRecentTransactions(data || []);
      }
    } catch (err) {
      console.error('Error fetching recent transactions:', err.message);
      setRecentTransactions([]);
    }
  };

  // Generate date options for the last 30 days and next 7 days
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    // Add past 30 days
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    // Add next 7 days
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const dateOptions = generateDateOptions();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateExpenseForm = () => {
    if (!expenseData.customerName.trim()) {
      setMessage('Customer name is required');
      return false;
    }
    if (!expenseData.cashInOut) {
      setMessage('Please select Cash IN or Cash OUT');
      return false;
    }
    if (!expenseData.description.trim()) {
      setMessage('Description is required');
      return false;
    }
    if (!expenseData.amount || parseFloat(expenseData.amount) <= 0) {
      setMessage('Please enter a valid amount');
      return false;
    }
    if (!expenseData.date) {
      setMessage('Please select a date');
      return false;
    }
    return true;
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateExpenseForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const expenseTransaction = {
        transactionId: uuidv4(), // Generate new UUID
        transactionType: 'CASH', // Set to CASH
        name: expenseData.customerName, // Customer name from form
        customerId: null, // Can be linked later if needed
        sellerId: null, // Can be linked later if needed
        transactionDate: expenseData.date, // Selected date from form
        amount: expenseData.cashInOut === 'CASH OUT' ? -parseFloat(expenseData.amount) : parseFloat(expenseData.amount), // Negative for CASH OUT, positive for CASH IN
        receiverBank: null, // Not applicable for cash transactions
        sellerName: null, // Not applicable for this transaction
        description: expenseData.description, // Description from form
        created_at: new Date().toISOString() // Current date and time
      };

      const { data, error } = await supabase
        .from('Transactions')
        .insert([expenseTransaction])
        .select();

      if (error) {
        setMessage('Error recording transaction: ' + error.message);
      } else {
        setMessage(`Transaction recorded successfully! Transaction ID: ${expenseTransaction.transactionId}`);
        // Reset form
        setExpenseData({
          customerName: '',
          cashInOut: '',
          description: '',
          amount: '',
          date: ''
        });
        setShowExpenseForm(false);
        // Refresh balance and recent transactions
        fetchCashBalance();
        fetchRecentTransactions();
      }
    } catch (err) {
      setMessage('Error recording transaction: ' + err.message);
    }
    setIsLoading(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="cash-records-container">
      {/* Balance Display */}
      {/* <div className="balance-card">
        <div className="balance-header">
          <h2 className="balance-title">Cash Balance</h2>
          <button 
            onClick={fetchCashBalance}
            className="refresh-balance-btn"
            title="Refresh Balance"
          >
            <svg className="refresh-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </button>
        </div>
        <div className="balance-amount">
          <span className="currency">₹</span>
          <span className={`amount ${cashBalance >= 0 ? 'positive' : 'negative'}`}>
            {Math.abs(cashBalance).toFixed(2)}
          </span>
        </div>
        <p className="balance-subtitle">Total Available Cash at Shop</p>
      </div> */}

      {/* Action Buttons */}
      {/* <div className="action-buttons">
        <button 
          onClick={() => setShowExpenseForm(!showExpenseForm)}
          className="add-expense-btn"
        >
          {showExpenseForm ? 'Cancel' : 'Add Cash Transaction'}
        </button>
      </div> */}

      {/* Message Alert */}
      {/* {message && (
        <div className={`message-alert ${message.includes('Error') ? 'error' : 'success'}`}>
          {message.includes('Error') ? (
            <svg className="message-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="message-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
          <span>{message}</span>
        </div>
      )} */}

      {/* Cash Transaction Form */}
      {showExpenseForm && (
        <div className="expense-form-container">
          <div className="expense-form-header">
            <h3 className="expense-form-title">Add Cash Transaction</h3>
            <p className="expense-form-subtitle">Record cash income or expense</p>
          </div>

          <form onSubmit={handleExpenseSubmit} className="expense-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="customerName" className="form-label">
                  Customer Name
                </label>
                <select
                  id="customerName"
                  name="customerName"
                  value={expenseData.customerName}
                  onChange={handleInputChange}
                  required
                  className="form-select"
                >
                  <option value="">Select Customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.name}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="cashInOut" className="form-label">
                  Cash IN/OUT
                </label>
                <select
                  id="cashInOut"
                  name="cashInOut"
                  value={expenseData.cashInOut}
                  onChange={handleInputChange}
                  required
                  className="form-select"
                >
                  <option value="">Select Type</option>
                  <option value="CASH IN">CASH IN</option>
                  <option value="CASH OUT">CASH OUT</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="amount" className="form-label">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={expenseData.amount}
                  onChange={handleInputChange}
                  required
                  min="0.01"
                  step="0.01"
                  className="form-input"
                  placeholder="Enter amount"
                />
              </div>

              <div className="form-group">
                <label htmlFor="date" className="form-label">
                  Date
                </label>
                <select
                  id="date"
                  name="date"
                  value={expenseData.date}
                  onChange={handleInputChange}
                  required
                  className="form-select"
                >
                  <option value="">Select Date</option>
                  {dateOptions.map(date => (
                    <option key={date} value={date}>
                      {formatDate(date)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={expenseData.description}
                  onChange={handleInputChange}
                  required
                  className="form-textarea"
                  placeholder="Enter transaction description"
                  rows="3"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                disabled={isLoading}
                className="submit-button"
              >
                {isLoading ? 'Recording...' : 'Record Transaction'}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setExpenseData({
                    customerName: '',
                    cashInOut: '',
                    description: '',
                    amount: '',
                    date: ''
                  });
                  setMessage('');
                }}
                className="reset-button"
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recent Transactions */}
      {/* <div className="recent-transactions-container">
        <div className="recent-transactions-header">
          <h3 className="recent-transactions-title">Recent Cash Transactions</h3>
          <button 
            onClick={fetchRecentTransactions}
            className="refresh-transactions-btn"
            title="Refresh Transactions"
          >
            <svg className="refresh-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </button>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="transactions-list">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="transaction-item">
                <div className="transaction-info">
                  <div className="transaction-name">{transaction.name}</div>
                  <div className="transaction-description">{transaction.description}</div>
                  <div className="transaction-date">{formatDate(transaction.transactionDate)}</div>
                </div>
                <div className={`transaction-amount ${parseFloat(transaction.amount) >= 0 ? 'positive' : 'negative'}`}>
                  ₹{Math.abs(parseFloat(transaction.amount)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-transactions">
            <p>No recent cash transactions found</p>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default CashRecords;
