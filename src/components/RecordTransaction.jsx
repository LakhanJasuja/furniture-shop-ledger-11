import React, { useState } from 'react';
import { supabase } from '../client/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import './RecordTransaction.css';

const RecordTransaction = () => {
  const [formData, setFormData] = useState({
    transactionType: '',
    customerName: '',
    sellerName: '',
    receiverBank: '',
    amount: '',
    transactionDate: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear conditional fields when transaction type changes
    if (name === 'transactionType') {
      setFormData(prev => ({
        ...prev,
        sellerName: '',
        receiverBank: ''
      }));
    }
  };

  const validateForm = () => {
    if (!formData.transactionType) {
      setMessage('Please select a transaction type');
      return false;
    }
    if (!formData.customerName.trim()) {
      setMessage('Customer name is required');
      return false;
    }
    if (formData.transactionType === 'CONTRA' && !formData.sellerName.trim()) {
      setMessage('Seller name is required for CONTRA transactions');
      return false;
    }
    if (formData.transactionType === 'BANK' && !formData.receiverBank.trim()) {
      setMessage('Receiver bank is required for BANK transactions');
      return false;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setMessage('Please enter a valid amount');
      return false;
    }
    if (!formData.transactionDate) {
      setMessage('Please select a transaction date');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const transactionData = {
        transactionId: uuidv4(), // Generate new UUID for each transaction
        transactionType: formData.transactionType,
        name: formData.customerName,
        customerId: null, // You can link this to a customer ID if needed
        sellerId: null, // You can link this to a seller ID if needed
        transactionDate: formData.transactionDate,
        amount: parseFloat(formData.amount),
        created_at: new Date().toISOString() // Current date and time
      };

      // Add conditional fields based on transaction type
      if (formData.transactionType === 'CONTRA') {
        transactionData.sellerName = formData.sellerName;
      }
      if (formData.transactionType === 'BANK') {
        transactionData.receiverBank = formData.receiverBank;
      }

      const { data, error } = await supabase
        .from('Transactions') // Using the exact table name from your schema
        .insert([transactionData])
        .select();

      if (error) {
        setMessage('Error recording transaction: ' + error.message);
      } else {
        setMessage(`Transaction recorded successfully! Transaction ID: ${transactionData.transactionId}`);
        // Reset form
        setFormData({
          transactionType: '',
          customerName: '',
          sellerName: '',
          receiverBank: '',
          amount: '',
          transactionDate: ''
        });
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
    <div className="record-transaction-container">
      <div className="transaction-header">
        <h2 className="transaction-title">Record Transaction</h2>
        <p className="transaction-subtitle">Add new transaction to the ledger</p>
      </div>

      {message && (
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
      )}

      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="transactionType" className="form-label">
              Transaction Type
            </label>
            <select
              id="transactionType"
              name="transactionType"
              value={formData.transactionType}
              onChange={handleInputChange}
              required
              className="form-select"
            >
              <option value="">Select Transaction Type</option>
              <option value="CASH">CASH</option>
              <option value="BANK">BANK</option>
              <option value="CONTRA">CONTRA</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="customerName" className="form-label">
              Customer Name 
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              required
              className="form-input"
              placeholder="Enter customer name"
            />
          </div>
        </div>

        {/* Conditional Fields */}
        {formData.transactionType === 'CONTRA' && (
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sellerName" className="form-label">
                Seller Name 
              </label>
              <input
                type="text"
                id="sellerName"
                name="sellerName"
                value={formData.sellerName}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="Enter seller name"
              />
            </div>
          </div>
        )}

        {formData.transactionType === 'BANK' && (
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="receiverBank" className="form-label">
                Receiver Bank 
              </label>
              <input
                type="text"
                id="receiverBank"
                name="receiverBank"
                value={formData.receiverBank}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="Enter receiver bank name"
              />
            </div>
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount" className="form-label">
              Amount 
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              required
              min="0.01"
              step="0.01"
              className="form-input"
              placeholder="Enter amount"
            />
          </div>

          <div className="form-group">
            <label htmlFor="transactionDate" className="form-label">
              Transaction Date 
            </label>
            <select
              id="transactionDate"
              name="transactionDate"
              value={formData.transactionDate}
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
              setFormData({
                transactionType: '',
                customerName: '',
                sellerName: '',
                receiverBank: '',
                amount: '',
                transactionDate: ''
              });
              setMessage('');
            }}
            className="reset-button"
          >
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecordTransaction;
